import { useEffect, useState, useRef } from 'react';
import ReactDOM from "react-dom";
import ModalConnections from '../components/dashboard/ModalConnections';
import ConnectionCard from '../components/dashboard/ConnectionCard';
import PortfolioCard from '../components/dashboard/PortfolioCard';
import apiService from '../services/api/ApiService';
import '../styles/dashboard.css'

const Dashboard = () => {
    const [showModalConnections, setShowModalConnections] = useState(false);
    const isEffectExecuted = useRef(false); 
    const { getUserData, createPortfolio } = apiService();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!isEffectExecuted.current) {
            isEffectExecuted.current = true; 

            getUserData()
            .then(data => setUserData(data))
            .catch(error => {
                console.error("An error occured :", error);
            });
        }
    }, [getUserData]);

    const handleLogout = () => {
        localStorage.removeItem('bearerToken');

        window.location.href = '/login';
    }

    return(
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 10 }}>
                <div style={{ display: 'inline-flex' }}>
                    <button onClick={handleLogout} className="cardButton" style={{padding: 10, fontSize: 15 }}>
                        Logout
                    </button>
                </div>
            </div>


            <div className='titleDiv'>
                <div className='titleDiv-font'>Connexions</div>
                <div className='titleDiv-underline'></div>
            </div>
            <div className='container'>
                <div className='plusCard plusCardConnections' onClick={() => setShowModalConnections(true)}>
                    <img className='plusSvg' src="/plus.svg" alt='PlusSVG'/>
                </div>
                {/* Page modal pour choisir la connexion souhaitée */}
                {showModalConnections && ReactDOM.createPortal(
                    <ModalConnections onClose={() => {setShowModalConnections(false)}} />,
                    document.body
                )}

                {userData && userData.connections.length > 0 && (
                    userData.connections.map((connection, index) => (
                        <ConnectionCard key={index} connection={connection} setUserData={setUserData} />
                    ))
                )}
            </div>
            <div className='titleDiv'>
                <div className='titleDiv-font'>Portfolios</div>
                <div className='titleDiv-underline'></div>
            </div>
            <div className='container'>
                <div className='plusCard plusCardPortfolios' onClick={() => createPortfolio(setUserData)}>
                    <img className='plusSvg' src="/plus.svg" alt='PlusSVG'/>
                </div>
                {userData && userData.portfolios.length > 0 && (
                    userData.portfolios.map((portfolio, index) => (
                        <PortfolioCard key={index} portfolio={portfolio} setUserData={setUserData} />
                    ))
                )}
            </div>
        </div>    
    )  
}

export default Dashboard;
