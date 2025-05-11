import ReactDOM from 'react-dom';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../styles/modal.css';
import '../../styles/portfolio.css';
import apiService from "../../services/api/ApiService";


const Toolbar = ({portfolioUuid, items, title, setTitle}) => {
    const [showModal, setShowModal] = useState(false)
    const [isVisible, setIsVisible] = useState(true);
    const [newTitle, setNewTitle] = useState(title)
    const toggleToolbar = () => setIsVisible(!isVisible);

    const { updatePortfolio } = apiService();

    const toolbarClass = `toolbar ${isVisible ? 'expanded' : 'collapsed'}`;

    const handleSave = () => {
        const data = {
            "title": title,
            "content": items
        }
        updatePortfolio(portfolioUuid, data)
        .catch(err => {
            console.error("Erreur lors de la récupération du portfolio :", err);
        });
    }

    const handleRename = () => {
        setTitle(newTitle)
        setShowModal(false);
    };

    return (
        <div className="toolbarcontainer">
            <div className={toolbarClass}>
                {isVisible && (
                    <div>
                        <p>Toolbar</p>
                        <div>{title}</div>
                        <button className="button" onClick={() => {setShowModal(true)}}>Rename portfolio</button>
                        <button className="button" onClick={handleSave}>Save</button>
                    </div>
                )}
            </div>

            <button onClick={toggleToolbar} aria-label="toggle toolbar" className="displaybutton">
                <FontAwesomeIcon icon={isVisible ? faChevronRight : faChevronLeft} />
            </button>
            {showModal && ReactDOM.createPortal(
                <div className="modalBackground" onClick={() => setShowModal(false)}>
                    <div className="modalDiv" onClick={(e) => e.stopPropagation()}>
                        <input
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            style={{ width: '100%', padding: '8px', fontSize: '16px', boxSizing: 'border-box' }}
                        />
                        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <button className="button" onClick={handleRename}>Save</button>
                            <button className="button" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Toolbar;
