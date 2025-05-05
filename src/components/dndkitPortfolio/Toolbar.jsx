import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../styles/portfolio.css';


const Toolbar = () => {
    const [isVisible, setIsVisible] = useState(true);
    const toggleToolbar = () => setIsVisible(!isVisible);

    const toolbarClass = `toolbar ${isVisible ? 'expanded' : 'collapsed'}`;

    return (
        <div className="toolbarcontainer">
            <div className={toolbarClass}>
                {isVisible && (
                    <div>
                        <p>Options</p>
                        <button className="button">Option 1</button>
                        <button className="button">Option 2</button>
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
