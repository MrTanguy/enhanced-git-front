import { useParams } from "react-router-dom";
import apiService from "../services/api/ApiService";
import { useEffect, useState, useMemo } from "react";
import '../styles/portfolio.css'
import DisplayPortfolio from "../components/dndkitPortfolio/DisplayPortfolio";

const Portfolio = () => {
    const { portfolioUuid } = useParams();
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getPortfolioData } = useMemo(() => apiService(), []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        getPortfolioData(portfolioUuid)
            .then(data => {
                setPortfolioData(data?.content || null);
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

    return (
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
          <DisplayPortfolio items={portfolioData} isEditable={false} />
        </div>
      );
};

export default Portfolio;
