import { useNavigate } from "react-router-dom";

const PortfolioCard = ({ portfolio }) => {

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/${portfolio.uuid}`);
    };    

    return (
        <div className='plusCard plusCardPortfolios' onClick={handleRedirect}>
            <div className="titleCard">{portfolio.title}</div>
            <div>{portfolio.description}</div>
        </div>
    )
}

export default PortfolioCard;