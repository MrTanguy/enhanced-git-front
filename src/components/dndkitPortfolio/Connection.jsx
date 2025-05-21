import { useDraggable } from '@dnd-kit/core';
import '../../styles/portfolio/connection.css';

export default function Title({ item, id }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isDragging,
    } = useDraggable({
      id: `item-${id}`,
    });

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
            <div ref={setNodeRef} className={className} style={style} {...attributes} {...listeners}>
                a
            </div>
        </>
        
    )
}