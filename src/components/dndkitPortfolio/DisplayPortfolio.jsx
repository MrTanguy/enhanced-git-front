import { useDroppable } from '@dnd-kit/core';
import Square from './Square';
import Title from './Title';

export default function DisplayPortfolio({ items, onItemUpdate, isEditable }) {
  const { setNodeRef } = useDroppable({ id: 'droppable' });

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
        switch (item.type) {
          case 'title':
            return <Title key={index} item={item} id={index} onUpdate={onItemUpdate} isEditable={isEditable}/>;
          case 'text':
            return <Square key={index} item={item} id={index} />;
          case 'image':
            return <img key={index} alt="placeholder" />;
          default:
            return <span key={index}>❓ Inconnu</span>;
        }
      })}
    </div>
  );
}
