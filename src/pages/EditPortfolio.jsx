import { useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import apiService from "../services/api/ApiService";
import Sidebar from "../components/dndkitPortfolio/Sidebar";
import DisplayPortfolio from "../components/dndkitPortfolio/DisplayPortfolio";
import Toolbar from "../components/dndkitPortfolio/Toolbar";

const EditPortfolio = () => {
  const { portfolioUuid } = useParams();

  const [listItems, setListItems] = useState([]);
  const [oldListItems, setOldListItems] = useState([]);
  const [title, setTitle] = useState();
  const [oldTitle, setOldTitle] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const droppableRef = useRef(null);

  const api = useMemo(() => apiService(), []);

  const { getPortfolioData } = api;

  const checkIfUpdated = (newItems = listItems, newTitle = title) => {
    const listChanged = JSON.stringify(newItems) !== JSON.stringify(oldListItems);
    const titleChanged = newTitle !== oldTitle;
    setIsUpdated(listChanged || titleChanged);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    getPortfolioData(portfolioUuid)
      .then(data => {
        const deepCopyContent = JSON.parse(JSON.stringify(data.content));
        const deepCopyTitle = JSON.parse(JSON.stringify(data.title));

        setOldListItems(deepCopyContent);
        setListItems(deepCopyContent);
        setOldTitle(deepCopyTitle);
        setTitle(deepCopyTitle);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération du portfolio :", err);
        setError("Impossible de charger le portfolio.");
        setLoading(false);
      });
  }, [portfolioUuid, getPortfolioData]);

  if (loading) return <div className="loader"></div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const gridSize = 10;
  const snapToGridModifier = ({ transform, over }) => {
    if (over?.id === "droppable") {
      return {
        ...transform,
        x: Math.round(transform.x / gridSize) * gridSize,
        y: Math.round(transform.y / gridSize) * gridSize,
      };
    }
    return transform;
  };

  const UpdateItems = (index, updates) => {
    setListItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      checkIfUpdated(updated);
      return updated;
    });
  };

  const handleDeleteItem = (index) => {
    setListItems(prev => {
      const updated = prev.filter((_, i) => i !== index);
      checkIfUpdated(updated);
      return updated;
    });
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

    const container = droppableRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    const xPercent = (snappedX / containerRect.width) * 100;
    const yPercent = (snappedY / containerRect.height) * 100;

    const id = active.id;

    if (id.startsWith("draggable-")) {
      const type = active.data.current?.type;
      const newItem = { type, x: xPercent, y: yPercent };

      setListItems(prev => {
        const updated = [...prev, newItem];
        checkIfUpdated(updated);
        return updated;
      });
    } else if (id.startsWith("item-")) {
      const index = parseInt(id.split("-")[1]);
      setListItems(prev => {
        const updated = [...prev];
        const current = updated[index];

        if (current.x !== xPercent || current.y !== yPercent) {
          updated[index] = { ...current, x: xPercent, y: yPercent };
        }

        checkIfUpdated(updated);
        return updated;
      });
    }
  };

  const UpdateTitle = (newTitle) => {
    setTitle(newTitle);
    checkIfUpdated(listItems, newTitle);
  };

  const handleSaveSuccess = () => {
    const deepCopy = JSON.parse(JSON.stringify(listItems));
    setOldListItems(deepCopy);
    setOldTitle(title);
    setIsUpdated(false);
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
        <DisplayPortfolio
          ref={droppableRef}
          items={listItems}
          isEditable={true}
          onItemUpdate={UpdateItems}
          onItemDelete={handleDeleteItem}
        />
      </div>
      <Toolbar
        portfolioUuid={portfolioUuid}
        items={listItems}
        title={title}
        setTitle={UpdateTitle}
        isUpdated={isUpdated}
        onSaveSuccess={handleSaveSuccess}
      />
    </DndContext>
  );
};

export default EditPortfolio;
