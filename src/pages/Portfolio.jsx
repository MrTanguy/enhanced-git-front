import { useParams } from "react-router-dom";
import apiService from "../services/api/ApiService";
import { useEffect, useState } from "react";
import '../styles/portfolio.css'

const Portfolio = () => {
    const { portfolioUuid } = useParams();
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { getPortfolioData } = apiService();

    useEffect(() => {
        setLoading(true);
        setError(null);

        getPortfolioData(portfolioUuid)
            .then(data => {
                setPortfolioData(data);
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

    return (
        <div>
            <h1>{portfolioData?.title}</h1>
            <p>{portfolioData?.description}</p>
        </div>
    );
};

export default Portfolio;
