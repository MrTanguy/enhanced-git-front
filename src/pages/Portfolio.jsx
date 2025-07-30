import { useParams } from "react-router-dom";
import apiService  from "../services/api/ApiService";
import { useEffect, useState } from "react";
import '../styles/portfolio.css'
import DisplayPortfolio from "../components/dndkitPortfolio/DisplayPortfolio";

const Portfolio = () => {
    const { portfolioUuid } = useParams();
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getPortfolioData } = apiService ();

    useEffect(() => {
        setLoading(true);
        setError(null);

        getPortfolioData(portfolioUuid)
            .then(data => {
                setPortfolioData(data?.content || null);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [portfolioUuid]);

    if (loading) return <div style={{ display: "flex", justifyContent: "center", marginTop: "8%" }}><div className="loader"></div></div>;
    if (error) return <div style={{ display: "flex", justifyContent: "center", marginTop: "8%" }}><p style={{ color: "red", fontSize: 20 }}>{error}</p></div>;

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
