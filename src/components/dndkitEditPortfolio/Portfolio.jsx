import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';

function DroppedItem({ item, id }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isDragging,
    } = useDraggable({
      id: `item-${id}`,
    });
  
    const style = {
      position: 'absolute',
      top: item.y,
      left: item.x,
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : 'translate3d(0, 0, 0)', 
      width: 100,
      height: 100,
      border: '1px solid #000',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'move',
      zIndex: isDragging ? 10 : 1,
    };
  
    let content;
    if (item.type === 'text') {
      content = <span style={{ fontSize: 14 }}>📝 Texte</span>;
    } else if (item.type === 'image') {
      content = <img alt="placeholder" />;
    } else {
      content = <span>❓ Inconnu</span>;
    }
  
    return (
      <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
        {content}
      </div>
    );
  }

const Droppable = ({ id, items }) => {
  const { setNodeRef } = useDroppable({ id });

  const style = {
    width: "80vw",
    height: "90vh",
    border: "1px solid #A6A8AD",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#fff"
  };

  return (
    <div ref={setNodeRef} style={style}>
      {items.map((item, index) => (
        <DroppedItem key={index} item={item} id={index} />
      ))}
    </div>
  );
};

export default function Portfolio({ items }) {
  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Droppable id="droppable" items={items} />
    </div>
  );
}
