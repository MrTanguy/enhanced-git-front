import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import apiService from "../services/api/ApiService";
import Sidebar from "../components/dndkitPortfolio/Sidebar";
import DisplayPortfolio from "../components/dndkitPortfolio/DisplayPortfolio";

const EditPortfolio = () => {
  const { portfolioUuid } = useParams();
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getPortfolioData } = apiService();

  useEffect(() => {
      setLoading(true);
      setError(null);

      getPortfolioData(portfolioUuid)
          .then(data => {
            setListItems(data.content);
            setLoading(false);
          })
          .catch(err => {
              console.error("Erreur lors de la récupération du portfolio :", err);
              setError("Impossible de charger le portfolio.");
              setLoading(false);
          });
  }, [portfolioUuid]);

  if (loading) return <div className="loader"></div>;;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const gridSize = 10;
  const snapToGridModifier = ({ transform, active, over }) => {
    if (over?.id === "droppable") {
      return {
        ...transform,
        x: Math.round(transform.x / gridSize) * gridSize,
        y: Math.round(transform.y / gridSize) * gridSize,
      };
    }
    return transform;
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;

    if (!over || over.id !== "droppable") return;

    const draggableRect = active.rect.current.translated;
    const droppableRect = over.rect;

    const rawX = draggableRect.left - droppableRect.left;
    const rawY = draggableRect.top - droppableRect.top;

    const snappedX = Math.round(rawX / gridSize) * gridSize;
    const snappedY = Math.round(rawY / gridSize) * gridSize;

    const id = active.id;

    if (id.startsWith("draggable-")) {
      const type = active.data.current?.type;
      const newItem = { type, x: snappedX, y: snappedY };
      setListItems((prev) => [...prev, newItem]);
    } else if (id.startsWith("item-")) {
      const index = parseInt(id.split("-")[1]);
      const updated = [...listItems];
      const current = updated[index];

      if (current.x !== snappedX || current.y !== snappedY) {
        updated[index] = { ...current, x: snappedX, y: snappedY };
        setListItems(updated);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[snapToGridModifier]}>
      <Sidebar />
      <div
        style={{
          height: "calc(100vh - 70px)",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <DisplayPortfolio items={listItems} isEditable={true} onItemUpdate={(index, updates) => {
          setListItems(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...updates };
            return updated;
          });
        }} />
      </div>
    </DndContext>
  );
};

export default EditPortfolio;
