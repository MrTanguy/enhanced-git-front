import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function Draggable({ id, type, children }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data: { type },
        activationConstraint: {
            distance: 10,
        },
    });
      
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        border: '2px solid white',
        padding: '10px 20px',
        backgroundColor: '#000',
        color: '#fff',
        borderRadius: '8px',
        cursor: 'grab',
        zIndex: isDragging ? 1000 : 'auto',
        position: isDragging ? 'fixed' : 'relative'
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {children}
        </div>
    );
}