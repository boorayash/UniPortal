import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const userRole = localStorage.getItem('role');
    const isAuthenticated = !!userRole;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />; // Or an Access Denied page
    }

    return <Outlet />;
};

export default ProtectedRoute;
