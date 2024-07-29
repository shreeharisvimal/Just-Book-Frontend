import React, {useEffect} from 'react';
import styles from './AdminLogout.module.scss';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import axios from '../../../Admin_axios'

function AdminLogout() {
    
const auth_user = useSelector((state) =>state.auth_user)
  const navigate = useNavigate()

  const Logout =async()=>{

    if (!auth_user.isAuthenticated){
      navigate('admin/')
      return;
    }
        const refresh_token = (localStorage.getItem('RefreshToken'))
        const token = (localStorage.getItem('AccessToken'))
        
           try {
             const res = await axios.post('logout/',{refresh_token:refresh_token},{headers:{
              'Authorization': `Bearer ${token}`
            }})
             localStorage.clear();
             axios.defaults.headers.common['Authorization'] = null;
             window.location.href = '/admin/'
             } catch (e) {
               console.log('logout not working', e)
             }
        
  }
  useEffect(() => {
    if (!auth_user.isAuthenticated) {
      navigate('/admin');
    }
  }, [auth_user.isAuthenticated, navigate]);
  return (
     <div className={styles.admin_logout__container}>
      <button className={styles.admin_logout__button} onClick={Logout}>LogOut</button>
    </div>
  )
}

export default AdminLogout
