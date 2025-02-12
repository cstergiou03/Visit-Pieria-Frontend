import React, { useState } from "react";
import CategoryRecord from "./CategoryRecord";
import "../StyleAdmin/categoriesTable.css";

function CategoriesTable({ data }) {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState(data); // Διαχείριση των δεδομένων των κατηγοριών

    console.log(data);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const determineType = (categoryId) => {
        if (categoryId.startsWith("destcat_")) return "destination";
        if (categoryId.startsWith("amencat_")) return "amenity";
        if (categoryId.startsWith("activcat_")) return "activity";
        return null;
    };

    // Συνάρτηση για την ανανέωση των δεδομένων μετά τη διαγραφή
    const handleCategoryDelete = (categoryId) => {
        // Φιλτράρουμε την κατηγορία που διαγράφηκε
        const updatedCategories = categories.filter(
            (category) => category.category_id !== categoryId
        );
        setCategories(updatedCategories);
    };

    return (
        <div className="destinations-table-container">
            <h2>Κατηγορίες</h2>
            <div className="destinations-list">
                {currentItems.map((category, index) => {
                    const type = determineType(category.category_id); // Προσδιορισμός τύπου βάσει προθέματος

                    return (
                        <CategoryRecord
                            key={index}
                            data={category}
                            type={type} // Παράδοση του τύπου στο CategoryRecord
                            onDelete={handleCategoryDelete} // Παράδοση της συνάρτησης διαγραφής
                        />
                    );
                })}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span>
                    Σελίδα {currentPage} από {totalPages}
                </span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default CategoriesTable;
