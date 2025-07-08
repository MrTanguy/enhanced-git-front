import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../styles/portfolio.css'
import Draggable from "./Draggable";

const Sidebar = () => {
    const [isVisible, setIsVisible] = useState(true);
    const toggleSidebar = () => setIsVisible(!isVisible);

    const sidebarClass = `sidebar ${isVisible ? 'expanded' : 'collapsed'}`;

    return (
        <div className="sidebarcontainer">
            <div className={sidebarClass}>
                {isVisible && (
                    <div>
                        <p>Elements</p>
                        <Draggable id="draggable-title" type="title">Title</Draggable>
                        <Draggable id="draggable-connection" type="connection">Connection</Draggable>
                        <Draggable id="draggable-text" type="text">Text</Draggable>
                    </div>
                )}
            </div>
            
            <button onClick={toggleSidebar} aria-label="toggle sidebar" className="displaybutton">
                <FontAwesomeIcon icon={isVisible ? faChevronLeft : faChevronRight} />
            </button>
        </div>      
    );
};


export default Sidebar;