import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Style/filterButton.css";

function FilterButton({ onFilterChange }) {
    const [destinationCategories, setDestinationCategories] = useState([]);
    const [amenityCategories, setAmenityCategories] = useState([]);
    const [activityCategories, setActivityCategories] = useState([]);
    const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [panelOpen, setPanelOpen] = useState(false);
    const [loadingDestinations, setLoadingDestinations] = useState(true);
    const [loadingAmenities, setLoadingAmenities] = useState(true);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem('loggedIn') === 'true');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDestinationCategories = async () => {
            try {
                const response = await fetch('https://discover-hellas-springboot-backend.onrender.com/api/destination/category/get/all');
                const data = await response.json();
                setDestinationCategories(data);
                setLoadingDestinations(false);
            } catch (error) {
                console.error('Error fetching destination categories:', error);
                setLoadingDestinations(false);
            }
        };

        const fetchAmenityCategories = async () => {
            try {
                const response = await fetch('https://discover-hellas-springboot-backend.onrender.com/api/amenity/category/get/all');
                const data = await response.json();
                setAmenityCategories(data);
                setLoadingAmenities(false);
            } catch (error) {
                console.error('Error fetching amenity categories:', error);
                setLoadingAmenities(false);
            }
        };

        const fetchActivityCategories = async () => {
            try {
                const response = await fetch('https://discover-hellas-springboot-backend.onrender.com/api/activity/category/get/all');
                const data = await response.json();
                setActivityCategories(data);
                setLoadingActivities(false);
            } catch (error) {
                console.error('Error fetching amenity categories:', error);
                setLoadingActivities(false);
            }
        };

        fetchDestinationCategories();
        fetchAmenityCategories();
        fetchActivityCategories();

        // Παρακολούθηση αλλαγών στο localStorage για το loggedIn
        const handleStorageChange = () => {
            setLoggedIn(sessionStorage.getItem('loggedIn') === 'true');
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleCategoryChange = (categoryId) => {
        const updatedTempCategories = tempSelectedCategories.includes(categoryId)
            ? tempSelectedCategories.filter(id => id !== categoryId)
            : [...tempSelectedCategories, categoryId];

        setTempSelectedCategories(updatedTempCategories);
    };

    const applyFilters = () => {
        setSelectedCategories(tempSelectedCategories);
        onFilterChange(tempSelectedCategories);
    };

    const handleViewPlanClick = () => {
        navigate('/planView');
    };

    return (
        <div className="filter-button-container">
            <button
                className="filter-button"
                onClick={() => {
                    setPanelOpen(!panelOpen);
                    setTempSelectedCategories(selectedCategories);
                }}
            >
                ⚙️ Φίλτρα
            </button>

            {!loggedIn && (
                <button
                    className="view-plan-button"
                    onClick={handleViewPlanClick}
                >
                    Προβολή Πλάνου
                </button>
            )}

            {panelOpen && (
                <div className="filter-panel">
                    <h3>Κατηγορίες Προορισμών</h3>
                    {loadingDestinations ? (
                        <p>Loading destination categories...</p>
                    ) : (
                        <ul>
                            {destinationCategories.map((category) => (
                                <li key={category.category_id}>
                                    <input
                                        type="checkbox"
                                        id={`destination-${category.category_id}`}
                                        checked={tempSelectedCategories.includes(category.category_id)}
                                        onChange={() => handleCategoryChange(category.category_id)}
                                    />
                                    <label htmlFor={`destination-${category.category_id}`}>{category.name}</label>
                                </li>
                            ))}
                        </ul>
                    )}

                    <h3>Κατηγορίες Δραστηριοτήτων</h3>
                    {loadingActivities ? (
                        <p>Loading activities categories...</p>
                    ) : (
                        <ul>
                            {activityCategories.map((category) => (
                                <li key={category.category_id}>
                                    <input
                                        type="checkbox"
                                        id={`activity-${category.category_id}`}
                                        checked={tempSelectedCategories.includes(category.category_id)}
                                        onChange={() => handleCategoryChange(category.category_id)}
                                    />
                                    <label htmlFor={`activity-${category.category_id}`}>{category.name}</label>
                                </li>
                            ))}
                        </ul>
                    )}

                    <h3>Κατηγορίες Παροχών</h3>
                    {loadingAmenities ? (
                        <p>Loading amenity categories...</p>
                    ) : (
                        <ul>
                            {amenityCategories.map((category) => (
                                <li key={category.category_id}>
                                    <input
                                        type="checkbox"
                                        id={`amenity-${category.category_id}`}
                                        checked={tempSelectedCategories.includes(category.category_id)}
                                        onChange={() => handleCategoryChange(category.category_id)}
                                    />
                                    <label htmlFor={`amenity-${category.category_id}`}>{category.name}</label>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="filter-buttons">
                        <button onClick={() => setPanelOpen(false)} className="close-panel-button">
                            Κλείσιμο
                        </button>
                        <button onClick={applyFilters} className="apply-button">
                            Εφαρμογή
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterButton;
