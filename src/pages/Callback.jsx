import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api/ApiService';

const Callback = () => {
    const navigate = useNavigate();
    const isEffectExecuted = useRef(false); 

    useEffect(() => {
        if (!isEffectExecuted.current) {
            isEffectExecuted.current = true; 

            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const site = params.get('site');

            if (code) {
                const { sendAccessToken } = apiService();

                fetch('http://votre-api/backend/oauth/callback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, site }),
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Réponse backend :', data);
                    navigate('/dashboard'); 
                })
                    .catch((error) => console.error('Erreur lors de la requête :', error));
            }
        }
    }, [navigate]);

    return <div>Traitement en cours...</div>;
};

export default Callback;
