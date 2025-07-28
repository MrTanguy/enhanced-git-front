import ReactDOM from 'react-dom';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../styles/modal.css';
import '../../styles/portfolio.css';
import apiService from "../../services/api/ApiService";

const Toolbar = ({ portfolioUuid, items, title, setTitle, isUpdated, onSaveSuccess }) => {
    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [newTitle, setNewTitle] = useState(title);
    const toggleToolbar = () => setIsVisible(!isVisible);

    const { updatePortfolio } = apiService();

    const toolbarClass = `toolbar ${isVisible ? 'expanded' : 'collapsed'}`;

    const handleSave = () => {
        const data = {
            title: title,
            content: items
        };
        updatePortfolio(portfolioUuid, data)
            .then(() => {
                onSaveSuccess();
            })
            .catch(err => {
                console.error("Erreur lors de la sauvegarde du portfolio :", err);
            });
    };

    const handleRename = () => {
        setTitle(newTitle);
        setShowModal(false);
    };

    return (
        <div className="toolbarcontainer">
            <div className={toolbarClass}>
                {isVisible && (
                    <div>
                        <div className="titlecontainer">
                            <p id="toolbar-title" className="title">Toolbar</p>
                        </div>
                        <div aria-label="Current portfolio title">{title}</div>
                        <button className="button" onClick={() => setShowModal(true)} aria-label="Rename portfolio">
                            Rename portfolio
                        </button>
                        <button
                            className={`button ${!isUpdated ? "disabled" : ""}`}
                            onClick={handleSave}
                            disabled={!isUpdated}
                            aria-label="Save portfolio"
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={toggleToolbar}
                aria-label="Toggle toolbar"
                className="displaybutton"
            >
                <FontAwesomeIcon icon={isVisible ? faChevronRight : faChevronLeft} />
            </button>

            {showModal && ReactDOM.createPortal(
                <div
                    className="modalBackground"
                    onClick={() => setShowModal(false)}
                    role="presentation"
                    aria-hidden="true"
                >
                    <div
                        className="modalDiv"
                        aria-modal="true"
                        aria-labelledby="rename-title-label"
                        data-testid="rename-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <label htmlFor="rename-title-input" id="rename-title-label" className="sr-only">
                            New title for the portfolio
                        </label>
                        <input
                            id="rename-title-input"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            aria-label="Edit portfolio title"
                            data-testid="rename-input-modal"
                            type="text"
                            style={{ width: '100%', padding: '8px', fontSize: '16px', boxSizing: 'border-box' }}
                        />
                        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <button className="button" onClick={handleRename} aria-label="Confirm rename">Save</button>
                            <button className="button" onClick={() => setShowModal(false)} aria-label="Cancel rename">Cancel</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Toolbar;
