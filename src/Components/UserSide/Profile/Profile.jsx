import React, { lazy, Suspense, useState, useEffect } from 'react';
import './Profile.scss';
import { useNavigate } from "react-router-dom";
import axios from '../../../axios';
import { useSelector } from 'react-redux';

const Prof = lazy(() => import('./ProfileComponent'));
const Tickets = lazy(() => import('./Tickets'));

function Profile() {
  const auth_user = useSelector((state) => state.auth_user);
  const navigate = useNavigate();
  const [changePage, setChangePage] = useState(true);
  const [userDetails, setThisuser] = useState(null);

  const Logout = async () => {
    if (!auth_user.isAuthenticated) {
      navigate('/');
      return;
    }
    try {
      const refresh_token = ((localStorage.getItem('RefreshToken')));
      const token = localStorage.getItem('AccessToken');
      const res = await axios.post('logout/', { refresh_token: refresh_token }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.clear();
      axios.defaults.headers.common['Authorization'] = null;
      window.location.href = '/';
    } catch (e) {
      console.log('logout not working', e);
    }
  };

  const FetchThisUser = async () => {
    try {
      const token = localStorage.getItem('AccessToken');
      const res = await axios.get(`Profile/`, {
        headers: {
          'content-type': 'multipart/form-data',
          'authorization': `Bearer ${token}`,
        }
      });

      if (res.status === 200) {
        setThisuser(res.data);
        localStorage.setItem('first_name', res.data.first_name)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!auth_user.isAuthenticated) {

    } else {
      FetchThisUser();
    }
  }, [auth_user.isAuthenticated, navigate]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="profile__container">
        <aside className="profile__aside">
          <button onClick={() => setChangePage(true)}>PROFILE</button>
          <button onClick={() => setChangePage(false)}>TICKETS</button>
          <div className="profile__picture-container">
            <img src={userDetails ? userDetails.profile_pic || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"}
              alt="avatar"
              className="profile__picture" />
          </div>
          <strong className='names'>
            <br />
            <p>{userDetails ? `${userDetails.first_name} ${userDetails.last_name}` : 'No Name Available'}</p>
          </strong>
        </aside>
        <main className="profile__main">
          {changePage ? <Prof /> : <Tickets />}
        </main>
        <button className="profile__logout" onClick={Logout}>LogOut</button>
      </div>
    </Suspense>
  );
}

export default Profile;
