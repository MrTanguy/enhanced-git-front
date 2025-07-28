import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../styles/portfolio.css';
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
            <div className="titlecontainer">
              <p id="sidebar-elements-title" className="title">Components</p>
            </div>
            <div style={{textAlign: "center", marginBottom: "15px", border: "solid 2px #739BF2", borderRadius: "8px"}}>
              <p>Drag&Drop a component to add it to your portfolio !</p>
            </div>
            <Draggable
              id="draggable-title"
              type="title"
              aria-label="Draggable title element"
              aria-describedby="sidebar-elements-title"
            >
              Title
            </Draggable>
            <Draggable
              id="draggable-project"
              type="project"
              aria-label="Draggable project element"
              aria-describedby="sidebar-elements-title"
            >
              Project
            </Draggable>
            <Draggable
              id="draggable-text"
              type="text"
              aria-label="Draggable text element"
              aria-describedby="sidebar-elements-title"
            >
              Text
            </Draggable>
          </div>
        )}
      </div>

      <button
        onClick={toggleSidebar}
        aria-label="toggle sidebar"
        className="displaybutton"
      >
        <FontAwesomeIcon icon={isVisible ? faChevronLeft : faChevronRight} />
      </button>
    </div>
  );
};

export default Sidebar;
