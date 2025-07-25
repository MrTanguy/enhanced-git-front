import { Navigate } from "react-router-dom";
import { UseAuth } from '../hooks/AuthProvider';

const ProtectedRoute = ({ children }) => {
    const { bearerToken } = UseAuth()

    if (!bearerToken) {
        return <Navigate to="/login" replace />
    }

    return children
};

export default ProtectedRoute;