import "../Style/event.css";
import Header from "./Header";
import PageTopDestination from "./PageTopDestination";
import DestinationGallery from "./DestinationGallery";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import DestinationInfo from "./DestinationInfo";
import LoginModal from "./LoginModal";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 39.0742,
    lng: 21.8243,
};

function Event() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [photosTable, setPhotosTable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapKey, setMapKey] = useState(Date.now());

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
    });

    // Λήψη των event δεδομένων από το API
    useEffect(() => {
        fetch(`https://discover-hellas-springboot-backend.onrender.com/api/event/get/${eventId}`)
            .then((response) => response.json())
            .then((data) => {
                setEvent(data);

                // Επεξεργασία των φωτογραφιών αν υπάρχουν
                if (data.photos) {
                    const photosTable = data.photos
                        .split("data:image/jpeg;base64,")
                        .filter((photo) => photo.trim() !== "")
                        .map((photo) =>
                            "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
                        );
                    setPhotosTable(photosTable);
                } else {
                    setPhotosTable([]);
                }

                setLoading(false); // Καθορισμός ότι έχει τελειώσει η φόρτωση
            })
            .catch((err) => {
                setError("Error fetching event data: " + err.message);
                setLoading(false);
            });
    }, [eventId]);

    useEffect(() => {
        if (event) {
            // Change the key only when the data is loaded
            setMapKey(Date.now());
        }
    }, [event]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div className="event-main-container">
                <Header />
                <h2>{error}</h2>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="event-main-container">
                <Header />
                <h2>Event not found</h2>
            </div>
        );
    }

    const handleDirectionsClick = () => {
        const latitude = event.latitude;
        const longitude = event.longitude;

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=&destination=${latitude},${longitude}`;

        window.open(googleMapsUrl, "_blank");
    };

    const handleApiLoaded = (map, maps) => {
        const latitude = parseFloat(event.latitude);
        const longitude = parseFloat(event.longitude);
    
        // Δημιουργία marker
        const marker = new maps.Marker({
            position: { lat: latitude, lng: longitude },
            map,
            title: event.name,
        });
    
        // Ρύθμιση του κέντρου και του zoom του χάρτη
        map.setCenter({ lat: latitude, lng: longitude });
        map.setZoom(12); // Προσαρμόζουμε το zoom για καλύτερη εμφάνιση
    };

    return (
        <div className="event-main-container">
            <PageTopDestination data={event} />
            <DestinationInfo data={event} />
            <DestinationGallery data={photosTable} />

            <div className="event-map-and-info">
                <div className="event-map-container">
                    {event.latitude && event.longitude ? (
                        <GoogleMap
                            key={mapKey}
                            mapContainerStyle={containerStyle}
                            center={{
                                lat: parseFloat(event.latitude) || defaultCenter.lat,
                                lng: parseFloat(event.longitude) || defaultCenter.lng,
                            }}
                            zoom={9}
                        >
                            {event.latitude && event.longitude && (
                                <MarkerF
                                    position={{
                                        lat: parseFloat(event.latitude),
                                        lng: parseFloat(event.longitude),
                                    }}
                                />
                            )}
                        </GoogleMap>
                    ) : (
                        <div>Δεν υπάρχουν διαθέσιμες συντεταγμένες για τον χάρτη.</div>
                    )}
                </div>

                <div className="event-info-right">
                    <div className="event-info-container">
                        <h1>Event Details</h1>
                        {/* <p><strong>Organizer:</strong> {event.organizer_id}</p> */}
                        <p><strong>Website:</strong> <a href={event.siteLink} target="_blank" rel="noopener noreferrer">Visit Site</a></p>
                    </div>
                    <button className="guide-button" onClick={handleDirectionsClick}>
                        Οδηγίες
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Event;
