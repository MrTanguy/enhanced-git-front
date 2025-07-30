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
                const doSend = async () => {
                    try {
                        const result = await sendAccessToken(code, site);
                        if (result) {
                            navigate('/dashboard');
                        } else {
                            console.error('Connection failed');
                        }
                    } catch (error) {
                        console.error('Error in sending access token', error);
                    }
                };
                doSend();
            } else {
                navigate('/dashboard');
            }
        }
    }, [navigate, sendAccessToken]);

    return <div>processing in progress...</div>;
};

export default Callback;
