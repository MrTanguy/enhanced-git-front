import { useParams } from 'react-router-dom';
import apiService from '../services/api/ApiService';
import { useEffect, useRef } from 'react';



const Portfolio = () =>  {
    const isEffectExecuted = useRef(false); 
    const { portfolioUuid } = useParams();
    const { getPotfolioData } = apiService();

    useEffect(() => {
        if (!isEffectExecuted.current) {
            isEffectExecuted.current = true; 
            getPotfolioData(portfolioUuid)
            .then(data => console.log(data))
            .catch(error => {
                console.error("Erreur lors de la récupération des données du portfolio :", error);
            })
        }
    })

    return (
        <div>
            hehe
        </div>
    )

}

export default Portfolio