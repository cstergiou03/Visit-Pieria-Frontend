import "../Style/destinationDesc.css";

function DestinationDesc({ description }) {
    return (
        <div className="destinationDesc-container">
            <h2 className="destinationDesc-title">Περιγραφή</h2>
            <p className="destinationDesc-text">
                {description || "Δεν υπάρχει διαθέσιμη περιγραφή για αυτόν τον προορισμό."}
            </p>
        </div>
    );
}

export default DestinationDesc;
