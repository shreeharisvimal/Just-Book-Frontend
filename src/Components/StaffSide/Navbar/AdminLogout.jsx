import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../../Admin_axios';
import './AdminLogout.scss';

const ForgetPass = React.lazy(() => import('../../ForgetPassword/ForgetPass'));

function AdminLogout() {
  const auth_user = useSelector((state) => state.auth_user);
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false)


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

  
  const ChangePassword =()=>{
    setShowChangePassword(!showChangePassword)
  };


  return (
    <React.Suspense fallback={<div>loading.....</div>}>
    <div className='admin-logout__container'>
      <button className='admin-logout__change-password-button' onClick={ChangePassword}>Change Password</button>
      <button className='admin-logout__button' onClick={logout}>LogOut</button>
      {showChangePassword && <ForgetPass setShowChangePassword={setShowChangePassword}/> }
    </div>
    </React.Suspense>
  );
}

export default AdminLogout;
