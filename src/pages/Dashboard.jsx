import { useState } from 'react';
import ReactDOM from "react-dom";
import ModalConnections from '../components/ModalConnections';
import '../styles/dashboard.css'
import { Children } from 'react';

const Dashboard = () => {
    const [showModalConnections, setShowModalConnections] = useState(false);

    return(
        <div>
            <div className='titleDiv'>
                <div className='titleDiv-font'>Connexions</div>
                <div className='titleDiv-underline'></div>
            </div>
            <div className='container'>
                <div className='plusCard' onClick={() => setShowModalConnections(true)} >
                    <img className='plusSvg' src="/plus.svg" alt='PlusSVG'/>
                </div>
                {/* Page modal pour choisir la connexion souhaitée */}
                {showModalConnections && ReactDOM.createPortal(
                    <ModalConnections onClose={() => {setShowModalConnections(false)}} />,
                    document.body
                )}
            </div>
            <div className='titleDiv'>
                <div className='titleDiv-font'>Portfolios</div>
                <div className='titleDiv-underline'></div>
            </div>
        </div>    
    )  
}

export default Dashboard;