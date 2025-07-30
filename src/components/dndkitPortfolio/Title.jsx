import { useDraggable } from '@dnd-kit/core';
import ReactDOM from 'react-dom';
import '../../styles/portfolio/title.css';
import { useState } from 'react';

export default function Title({ item, id, onUpdate, onDelete, isEditable }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `item-${id}`,
  });

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(item.title || 'Title');
  const [newTitle, setNewTitle] = useState(title);

  const className = `draggableTitle ${isDragging ? 'dragging' : ''}`;
  const style = {
    top: `${item.y}%`,
    left: `${item.x}%`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : 'translate3d(0, 0, 0)',
  };

  const handleSave = () => {
    onUpdate(id, { 'title': newTitle });
    setTitle(newTitle);
    setShowModal(false);
  };

  const handleDelete = () => {
    onDelete(id);
    setShowModal(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className={className}
        style={style}
        {...attributes}
        {...listeners}
        onDoubleClick={isEditable ? () => setShowModal(true) : undefined}
        aria-label="draggable title"
        tabIndex={0}
      >
        {title}
      </div>

      {showModal && ReactDOM.createPortal(
        <div
          className="modalBackground"
          data-testid="modal-background"
          onClick={() => setShowModal(false)}
          aria-modal="true"
          role="dialog"
          aria-labelledby={`edit-title-${id}`}
        >
          <div className="modalDiv" onClick={(e) => e.stopPropagation()}>
            <label htmlFor={`input-title-${id}`} id={`edit-title-${id}`} className="sr-only">
              Edit title
            </label>
            <input
              id={`input-title-${id}`}
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              aria-label="Edit title"
              style={{ width: '100%', padding: '8px', fontSize: '16px', boxSizing: 'border-box' }}
            />

            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="button"
                style={{ backgroundColor: '#f44336', color: 'white' }}
                onClick={handleDelete}
                aria-label="Delete title"
              >
                Delete
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="button" onClick={handleSave} aria-label="Save title">Save</button>
                <button className="button" onClick={() => setShowModal(false)} aria-label="Cancel editing">Cancel</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
