import { useDraggable } from '@dnd-kit/core';
import ReactDOM from 'react-dom';
import '../../styles/modal.css'; // pour appliquer les mêmes styles
import { useState } from 'react';

export default function Title({ item, id, onUpdate }) {
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
  const [title, setTitle] = useState(item.text || 'Title');
  const [newTitle, setNewTitle] = useState(title)
  
  const className=`draggableTitle ${isDragging ? 'dragging' : ''}`
  const style={
    top: item.y,
    left: item.x,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : 'translate3d(0, 0, 0)',
  }

  const handleDoubleClick = () => {
    setShowModal(true);
  };

  const handleSave = () => {
    onUpdate(id, { 'tile': newTitle });
    setTitle(newTitle)
    setShowModal(false);
  };

  return (
    <>
      <div ref={setNodeRef} className={className} style={style} {...attributes} {...listeners} onDoubleClick={handleDoubleClick}>
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
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="button" onClick={handleSave}>Save</button>
              <button className="button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
