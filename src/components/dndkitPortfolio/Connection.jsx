import { useDraggable } from '@dnd-kit/core';
import ReactDOM from 'react-dom';
import '../../styles/portfolio/connection.css';
import { useState } from 'react';

export default function Title({ item, id, isEditable }) {
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

    const className=`draggableConnection ${isDragging ? 'dragging' : ''}`
    const style={
    top: `${item.y}%`,
    left: `${item.x}%`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : 'translate3d(0, 0, 0)',
  };

    return (
        <>
            <div ref={setNodeRef} className={className} style={style} {...attributes} {...listeners} onDoubleClick={isEditable ? () => setShowModal(true) : undefined}>
                a
            </div>
            {showModal && ReactDOM.createPortal(
              <div className="modalBackground" onClick={() => setShowModal(false)}>
                <div className="modalDiv" onClick={(e) => e.stopPropagation()}>
                  a
                </div>
              </div>,
              document.body
            )}
        </>
        
    )
}