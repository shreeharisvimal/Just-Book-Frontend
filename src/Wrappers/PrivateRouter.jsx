import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import UserAuth from '../Utils/AuthUser';

function PrivateRouter({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const AuthInfo = await UserAuth();
      if (isMounted) {
        setIsAuthenticated(AuthInfo.isAuthenticated);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      toast.warning('Please login first', { autoClose: 2000 });
      setTimeout(() => {
        setShouldRedirect(true);
      }, 2000);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRouter;
