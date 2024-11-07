import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import isAuthUser from '../../../Utils/AuthUser';
import styles from './AdminNavBar.module.scss';

const Logout = React.lazy(() => import('./AdminLogout'));

function AdminNavBar() {
  const [openLogout, setOpenLogout] = useState(false);
  const AuthUser = useSelector((state) => state.auth_user);

  useEffect(() => {
    if (!AuthUser) {
      isAuthUser();
    }
  }, [AuthUser]);

  const handleOpen = () => {
    setOpenLogout(!openLogout);
  };

  return (
    <div className={styles.adminNavBar}>
      <div className={styles.adminNavBar__authButton} onClick={handleOpen}>
        {AuthUser.first_name && AuthUser.first_name}
      </div>
      {openLogout && <Logout />}
    </div>
  );
}

export default AdminNavBar;
