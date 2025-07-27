import { useDraggable } from '@dnd-kit/core';
import ReactDOM from 'react-dom';
import apiService from "../../services/api/ApiService";
import '../../styles/portfolio/project.css';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';

export default function Project({ item, id, isEditable, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `item-${id}`,
  });

  const { getUserData, getAllPublicProjects } = apiService();

  const [showModal, setShowModal] = useState(false);
  const [project, setProject] = useState(item.project)
  const [newProject, setNewProject] = useState(item.project)
  const [connections, setConnections] = useState();
  const [projects, setProjects] = useState();
  const [changeProjectStep, setChangeProjectStep] = useState(null)

  const className = `draggableProjet ${isDragging ? 'dragging' : ''}`;
  const style = {
    top: `${item.y}%`,
    left: `${item.x}%`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : 'translate3d(0, 0, 0)',
  };

  const handleSave = () => {
    setProject(newProject);
    onUpdate(id, { 'project': newProject });
    setShowModal(false);
    setChangeProjectStep(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setChangeProjectStep(null);
  }

  const handleDelete = () => {
    onDelete(id);
    setShowModal(false);
  }

  const handleConnectionSelection = async (connection) => {
    setChangeProjectStep("loading");
    const projects = await getAllPublicProjects(connection);
    setProjects(projects);
    setChangeProjectStep("project");
  }

  const handleProjectSelection = async (_project) => {
    setNewProject(_project);
    setChangeProjectStep(null);
  }

  const getConnections = async () => {
    setChangeProjectStep("loading");
    const data = await getUserData(true, false);
    if (data && data.connections) {
      setConnections(data.connections);
    }
    setChangeProjectStep("connection");
  };

  const handleRedirect = () => {
    const link = project.link;
    if (link) {
      window.open(link, "_blank");
    }
  };

  const getIconPath = (website) => {
    switch (website) {
      case 'github':
        return '/github.svg';
      case 'gitlab':
        return '/gitlab.svg';
      default:
        return '/default.svg';
    }
  };

  return (
    <>
      <div
        data-testid="project-div"
        ref={setNodeRef}
        className={className}
        style={style}
        {...attributes}
        {...listeners}
        onDoubleClick={isEditable ? () => setShowModal(true) : handleRedirect}
        role="button"
        tabIndex={0}
        aria-label={
          project?.name
            ? isEditable
              ? `Project: ${project.name}, double-click to edit`
              : `Project: ${project.name}, double-click to open link`
            : "No project selected"
        }
      >
        {project?.name ? (
          <img
            className="svgImage"
            src={getIconPath(project?.website)}
            alt={`${project?.website} icon`}
          />
        ) : null}
        {project?.name ? project.name : "No selected project"}
      </div>

      {showModal && ReactDOM.createPortal(
        <div
          className="modalBackground"
          onClick={() => setShowModal(false)}
          aria-label="Close modal"
        >
          <div
            className="modalDiv"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Edit project modal"
          >
            {changeProjectStep === "loading" &&
              <div data-testid="loader" aria-label="Loading projects">
                <ClipLoader color="#739BF2" size={50} speedMultiplier={0.7} />
              </div>
            }

            {changeProjectStep === null && (
              <div aria-label={`Selected project: ${newProject?.name || "None"}`}>
                {newProject ? newProject.name : "No selected project"}
              </div>
            )}

            {changeProjectStep === "connection" &&
              <div className="modalGrid" aria-label="Select a connection">
                {connections && connections.length > 0 && (
                  connections.map((connection, index) => (
                    <div
                      key={index}
                      className='modalChoice'
                      onClick={() => handleConnectionSelection(connection)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Connection: ${connection.username} on ${connection.website}`}
                    >
                      <img
                        className='svgImage'
                        src={getIconPath(connection.website)}
                        alt={`${connection.website} icon`}
                      />
                      {connection.username}
                    </div>
                  ))
                )}
              </div>
            }

            {changeProjectStep === "project" &&
              <div className="modalGrid" aria-label="Select a project">
                {projects && projects.length > 0 && (
                  projects.map((_project, index) => (
                    <div
                      key={index}
                      className='modalChoice'
                      onClick={() => handleProjectSelection(_project)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Project: ${_project.name}`}
                    >
                      {_project.name}
                    </div>
                  ))
                )}
              </div>
            }

            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="button"
                style={{ backgroundColor: '#f44336', color: 'white' }}
                onClick={handleDelete}
                aria-label="Delete project"
              >
                Delete
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="button" onClick={getConnections} aria-label="Change project">Change project</button>
                <button className="button" onClick={handleSave} aria-label="Save project">Save</button>
                <button className="button" onClick={handleCancel} aria-label="Cancel changes">Cancel</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
