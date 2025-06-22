import React, { forwardRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import Title from "./Title";
import Project from "./Project";

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

  const combinedRef = (node) => {
    setNodeRef(node);  
    if (ref) {
      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
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
          case "connection":
            return (
              <Project 
                key={index}
                item={item}
                id={index}
                onUpdate={onItemUpdate}
                isEditable={isEditable}
              />
            )
          default:
            return <span key={index}>❓ Inconnu</span>;
        }
      })}
    </div>
  );
});

export default DisplayPortfolio;
