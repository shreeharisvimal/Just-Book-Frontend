import React, { useEffect, useState } from 'react';
import AuthAdmin from '../Utils/AuthAdmin';
import { Navigate } from 'react-router-dom';
import './Loader.scss';

function AdminPrivateRouter({ children }) {
    const INITIAL_STATE = {
        isAuthenticated: false,
        isAdmin: false,
    };

    const [authState, setAuthState] = useState(INITIAL_STATE);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const authInfo = await AuthAdmin();
                if (isMounted) {
                    setAuthState({
                        isAuthenticated: authInfo.isAuthenticated,
                        isAdmin: authInfo.isAdmin,
                    });
                }
            } catch (error) {
                console.error('Error during authentication:', error);
            } finally {
                if (isMounted) {
                    setTimeout(() => {
                        setLoading(false);
                    }, 100); 
                }
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="loader"></div>
            </div>
        );
    }

    if (!authState.isAuthenticated) {
        return <Navigate to="/admin/" />; // Redirect to login if not authenticated
    }

    if (!authState.isAdmin) {
        return <Navigate to="/admin/" />; // Redirect to admin login if not admin
    }

    return children;
}

export default AdminPrivateRouter;
