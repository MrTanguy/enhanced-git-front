import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useDraggable } from "@dnd-kit/core";
import '../../styles/portfolio.css'
import Draggable from "./Draggable";

const Sidebar = () => {
    const [isVisible, setIsVisible] = useState(true);
    const toggleSidebar = () => setIsVisible(!isVisible);

    const sidebarClass = `sidebar ${isVisible ? 'expanded' : 'collapsed'}`;
    const sidebarButtonClass = `sidebarbutton ${isVisible ? 'expanded' : 'collapsed'}`;

    return (
        <div className="sidebarcontainer">
            <div className={sidebarClass}>
                {isVisible && (
                    <div>
                        <p>Elements</p>
                        <Draggable id="draggable-test" type="type">test</Draggable>
                        <Draggable id="draggable-text" type="text">text</Draggable>
                        <Draggable id="draggable-image" type="image">image</Draggable>
                    </div>
                )}
            </div>
            
            <button onClick={toggleSidebar} aria-label="toggle sidebar" className={sidebarButtonClass}>
                <FontAwesomeIcon icon={isVisible ? faChevronLeft : faChevronRight} />
            </button>
        </div>      
    );
};


export default Sidebar;