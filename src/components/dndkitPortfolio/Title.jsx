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
  const [newTitle, setNewTitle] = useState(title)
  
  const className=`draggableTitle ${isDragging ? 'dragging' : ''}`
  const style={
    top: `${item.y}%`,
    left: `${item.x}%`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : 'translate3d(0, 0, 0)',
  };

  const handleSave = () => {
    onUpdate(id, { 'title': newTitle });
    setTitle(newTitle)
    setShowModal(false);
  };

  const handleDelete = () => {
    onDelete(id)
    setShowModal(false)
  }

  return (
    <>
      <div ref={setNodeRef} className={className} style={style} {...attributes} {...listeners} onDoubleClick={isEditable ? () => setShowModal(true) : undefined}>
        {title}
      </div>
      {showModal && ReactDOM.createPortal(
        <div className="modalBackground" onClick={() => setShowModal(false)}>
          <div className="modalDiv" onClick={(e) => e.stopPropagation()}>
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px', boxSizing: 'border-box' }}
            />

            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="button" style={{ backgroundColor: '#f44336', color: 'white' }} onClick={handleDelete} >
                Delete
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="button" onClick={handleSave}>Save</button>
                <button className="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
