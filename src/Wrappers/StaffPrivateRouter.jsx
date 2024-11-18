import React, { useEffect, useState } from 'react';
import AuthAdmin from '../Utils/AuthAdmin';
import { Navigate } from 'react-router-dom';
import './Loader.scss';

function StaffPrivateRouter({ children }) {
    const INITIAL_STATE = {
        isAuthenticated: false,
        isAdmin: false,
        is_staff: false,
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
                        is_staff: authInfo.is_staff,
                    });
                }
            } catch (error) {
                console.error('Error during authentication:', error);
            } finally {
                if (isMounted) {
                    setTimeout(() => {
                        setLoading(false);
                    }, 200);
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
    if (!authState.isAdmin && !authState.is_staff) {
        return <Navigate to="/admin/" />;
    }
    return children;
}

export default StaffPrivateRouter;
