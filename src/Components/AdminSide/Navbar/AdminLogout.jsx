import React, { useEffect, useState } from 'react';
import styles from './AdminLogout.module.scss';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../../Admin_axios';

const ForgetPass = React.lazy(() => import('../../ForgetPassword/ForgetPass'));

function AdminLogout() {
  const auth_user = useSelector((state) => state.auth_user);
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const Logout = async () => {
    if (!auth_user.isAuthenticated) {
      navigate('/admin', { replace: true });
      return;
    }
    const refresh_token = localStorage.getItem('RefreshToken');
    const token = localStorage.getItem('AccessToken');

    try {
      await axios.post('logout/', { refresh_token }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      localStorage.clear();
      axios.defaults.headers.common['Authorization'] = null;
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

  const ChangePassword = () => {
    setShowChangePassword(!showChangePassword);
  };

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className={styles['admin-logout__container']}>
        <button className={styles['admin-logout__change-password-button']} onClick={ChangePassword}>Change Password</button>
        <button className={styles['admin-logout__button']} onClick={Logout}>LogOut</button>
        {showChangePassword && <ForgetPass setShowChangePassword={setShowChangePassword} />}
      </div>
    </React.Suspense>
  );
}

export default AdminLogout;
