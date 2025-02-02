import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api/ApiService';

const Callback = () => {
    const navigate = useNavigate();
    const isEffectExecuted = useRef(false); 
    const { sendAccessToken } = apiService();

    useEffect(() => {
        if (!isEffectExecuted.current) {
            isEffectExecuted.current = true; 

            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const site = params.get('site');

            if (code) {
                sendAccessToken(code, site)
                navigate('/dashboard')
            }
        }
    }, [navigate]);

    return <div>Traitement en cours...</div>;
};

export default Callback;
