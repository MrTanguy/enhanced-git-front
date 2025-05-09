import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../styles/portfolio.css';
import apiService from "../../services/api/ApiService";


const Toolbar = ({portfolioUuid, items, title, setTitle}) => {
    const [isVisible, setIsVisible] = useState(true);
    const toggleToolbar = () => setIsVisible(!isVisible);

    const { updatePortfolio } = apiService();

    const toolbarClass = `toolbar ${isVisible ? 'expanded' : 'collapsed'}`;

    const rename = () => {
        console.log("yes")
    }

    const save = () => {
        const data = {
            "title": title,
            "content": items
        }
        updatePortfolio(portfolioUuid, data)
        .catch(err => {
            console.error("Erreur lors de la récupération du portfolio :", err);
        });
    }

    return (
        <div className="toolbarcontainer">
            <div className={toolbarClass}>
                {isVisible && (
                    <div>
                        <p>Toolbar</p>
                        <div>{title}</div>
                        <button className="button" onClick={rename}>Rename portfolio</button>
                        <button className="button" onClick={save}>Save</button>
                    </div>
                )}
            </div>

            <button onClick={toggleToolbar} aria-label="toggle toolbar" className="displaybutton">
                <FontAwesomeIcon icon={isVisible ? faChevronRight : faChevronLeft} />
            </button>
        </div>
    );
};

export default Toolbar;
