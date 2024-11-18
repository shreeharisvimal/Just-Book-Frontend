import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import UserAuth from '../Utils/AuthUser';
import './Loader.scss';

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
        }, 1000);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      toast.warning('Please login first', { autoClose: 3000 });
      setTimeout(() => {
        setShouldRedirect(true);
      }, 1000);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader"></div>
      </div> 
    );
  }

  if (shouldRedirect) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRouter;
