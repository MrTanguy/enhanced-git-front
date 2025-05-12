import React, { forwardRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import Title from "./Title";

const DisplayPortfolio = forwardRef(({ items, isEditable, onItemUpdate }, ref) => {
  const { setNodeRef } = useDroppable({ id: "droppable" });

  const style = {
    width: "80vw",
    height: "90vh",
    border: "1px solid #A6A8AD",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#fff",
  };

  // Fonction pour fusionner les deux refs
  const combinedRef = (node) => {
    setNodeRef(node);    // DndKit
    if (ref) {
      if (typeof ref === "function") {
        ref(node);       // Si c’est une fonction
      } else {
        ref.current = node; // Sinon un ref classique
      }
    }
  };

  return (
    <div ref={combinedRef} style={style}>
      {items.map((item, index) => {
        switch (item.type) {
          case "title":
            return (
              <Title
                key={index}
                item={item}
                id={index}
                onUpdate={onItemUpdate}
                isEditable={isEditable}
              />
            );
          default:
            return <span key={index}>❓ Inconnu</span>;
        }
      })}
    </div>
  );
});

export default DisplayPortfolio;
