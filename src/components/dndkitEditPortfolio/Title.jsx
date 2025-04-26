import { useDraggable } from '@dnd-kit/core';

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
    padding: 8,
    boxSizing: 'border-box',
    borderRadius: 8,
    fontSize: 14,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onDoubleClick={() => console.log("Double clic détecté!")}>
      📝 Texte
    </div>
  );
}
