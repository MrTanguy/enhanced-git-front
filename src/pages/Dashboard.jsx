import { useEffect, useState, useRef } from 'react';
import ReactDOM from "react-dom";
import ModalConnections from '../components/ModalConnections';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api/ApiService';
import '../styles/dashboard.css'

const Dashboard = () => {
    const [showModalConnections, setShowModalConnections] = useState(false);
    const navigate = useNavigate();
    const isEffectExecuted = useRef(false); 
    const { getUserData } = apiService();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!isEffectExecuted.current) {
            isEffectExecuted.current = true; 

            getUserData()
            .then(data => setUserData(data))
            .catch(error => {
                console.error("Erreur lors de la récupération des données utilisateur :", error);
            });
        }
    }, [navigate, getUserData]);

    return(
        <div>
            <div className='titleDiv'>
                <div className='titleDiv-font'>Connexions</div>
                <div className='titleDiv-underline'></div>
            </div>
            <div className='container'>
                <div className='plusCard plusCardConnections' onClick={() => setShowModalConnections(true)} >
                    <img className='plusSvg' src="/plus.svg" alt='PlusSVG'/>
                </div>
                {/* Page modal pour choisir la connexion souhaitée */}
                {showModalConnections && ReactDOM.createPortal(
                    <ModalConnections onClose={() => {setShowModalConnections(false)}} />,
                    document.body
                )}
                {userData && userData.connections.length > 0 && (
                    userData.connections.map((connection, index) => (
                        <div key={index} className='plusCard'>
                            <p>{connection.website}</p>
                            <p> {connection.username}</p>
                            <p> {connection.id}</p>
                        </div>
                    ))
                )}
            </div>
            <div className='titleDiv'>
                <div className='titleDiv-font'>Portfolios</div>
                <div className='titleDiv-underline'></div>
            </div>
            <div className='container'>
                <div className='plusCard plusCardPortfolios' >
                    <img className='plusSvg' src="/plus.svg" alt='PlusSVG'/>
                </div>
            </div>
        </div>    
    )  
}

export default Dashboard;