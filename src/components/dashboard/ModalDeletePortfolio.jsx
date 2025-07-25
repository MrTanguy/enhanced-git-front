import '../../styles/modal.css';

const ModalDeletePortfolio = ({ setShowModalDeletePortfolio, onDelete }) => {
    const handleDelete = () => {
        onDelete(); 
    };

    return (
        <div className="modalOverlay" style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
        }}>
            <div className="modal" style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center"
            }}>
                <p>Are you sure you want to delete this portfolio?</p>
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 8 }}>
                    <button className="button" onClick={handleDelete}>Yes, delete</button>
                    <button className="button" onClick={() => setShowModalDeletePortfolio(false)}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ModalDeletePortfolio;
