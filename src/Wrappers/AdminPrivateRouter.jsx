import React, { useEffect, useState } from 'react';
import AuthAdmin from '../Utils/AuthAdmin';
import { Navigate } from 'react-router-dom';

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
                if (isMounted) setLoading(false);
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
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!authState.isAdmin) {
        return <Navigate to="/admin/" />;
    }

    return children;
}

export default AdminPrivateRouter;
