import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../../Admin_axios';
import './AdminLogout.scss';

function AdminLogout() {
  const auth_user = useSelector((state) => state.auth_user);
  const navigate = useNavigate();

  const logout = async () => {
    if (!auth_user.isAuthenticated) {
      navigate('/admin', { replace: true });
      
      return;
    }
    const refresh_token = localStorage.getItem('RefreshToken');
    const token = localStorage.getItem('AccessToken');

    try {
      await axios.post('logout/', { refresh_token }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      axios.defaults.headers.common['Authorization'] = null;
      localStorage.clear();
      navigate('/admin', { replace: true });
    } catch (e) {
      console.log('Logout not working', e);
    }
  };

  useEffect(() => {
    if (!auth_user.isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [auth_user.isAuthenticated, navigate]);

  return (
    <div className='admin-logout__container'>
      <button className='admin-logout__button' onClick={logout}>LogOut</button>
    </div>
  );
}

export default AdminLogout;
