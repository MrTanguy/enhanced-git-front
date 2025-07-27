import ReactDOM from "react-dom";
import { useState } from "react";
import ToastCustom from "../ToastCustom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faArrowUpRightFromSquare, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import ModalDeletePortfolio from "./ModalDeletePortfolio";
import apiService from "../../services/api/ApiService";

const PortfolioCard = ({ portfolio, setUserData }) => {
    const [showModalDeletePortfolio, setShowModalDeletePortfolio] = useState(false);
    const { deletePortfolio } = apiService();

    const openInNewTab = () => {
        window.open(`/${portfolio.uuid}`, '_blank');
    };

    const edit = () => {
        window.open(`/${portfolio.uuid}/edit`, "_self");
    }

    const copyToClipboard = () => {
        const currentUrl = window.location.origin;
        navigator.clipboard.writeText(`${currentUrl}/${portfolio.uuid}`);
        ToastCustom("URL copied to clipboard!", "success");
    };

    const handleDeletePortfolio = () => {
        deletePortfolio(portfolio, setUserData);
        setShowModalDeletePortfolio(false);
    };

    return (
        <div className='plusCard plusCardPortfolios' aria-label={`Portfolio card: ${portfolio.title}`}>
            <button
                className="deleteButton"
                onClick={() => setShowModalDeletePortfolio(true)}
                aria-label={`Delete portfolio "${portfolio.title}"`}
            >
                <img src="/cross.svg" alt="Delete icon" className="deleteIcon" />
            </button>

            <div className="titleCard" aria-label={`Portfolio title: ${portfolio.title}`}>
                {portfolio.title}
            </div>

            <div className="cardButtons">
                <button
                    className="cardButton"
                    onClick={openInNewTab}
                    aria-label={`Open portfolio "${portfolio.title}" in new tab`}
                >
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </button>

                <button
                    className="cardButton"
                    onClick={edit}
                    aria-label={`Edit portfolio "${portfolio.title}"`}
                >
                    <FontAwesomeIcon icon={faPen} />
                </button>

                <button
                    className="cardButton"
                    onClick={copyToClipboard}
                    aria-label={`Copy portfolio "${portfolio.title}" URL to clipboard`}
                >
                    <FontAwesomeIcon icon={faShareFromSquare} />
                </button>
            </div>

            {showModalDeletePortfolio && ReactDOM.createPortal(
                <ModalDeletePortfolio
                    setShowModalDeletePortfolio={setShowModalDeletePortfolio}
                    onDelete={handleDeletePortfolio}
                />,
                document.body
            )}
        </div>
    );
};

export default PortfolioCard;
