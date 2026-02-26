import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import API_URL from '../config/api';

const ProtectedRoute = ({ allowedRoles }) => {
    const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'denied'

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/verify`, {
                    credentials: 'include',
                });

                if (!res.ok) {
                    setStatus('denied');
                    return;
                }

                const data = await res.json();

                if (!data.authenticated) {
                    setStatus('denied');
                    return;
                }

                // Sync localStorage for UI display (name badge, sidebar)
                localStorage.setItem('role', data.role);
                localStorage.setItem('name', data.name);

                if (allowedRoles && !allowedRoles.includes(data.role)) {
                    setStatus('denied');
                    return;
                }

                setStatus('authenticated');
            } catch {
                setStatus('denied');
            }
        };

        verify();
    }, [allowedRoles]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (status === 'denied') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
