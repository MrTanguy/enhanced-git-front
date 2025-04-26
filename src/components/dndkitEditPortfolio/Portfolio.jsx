import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import Square from './Square';

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
      {items.map((item, index) => {
        if (item.type === 'text') {
          return <Square key={index} item={item} id={index} />;
        } else if (item.type === 'image') {
          return <img key={index} alt="placeholder" />;
        } else {
          return <span key={index}>❓ Inconnu</span>;
        }
      })}
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
