import React, { useEffect, useState } from 'react';
import './TheaterPage.scss';
import axios from '../../../Admin_axios';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';

const NavBar = React.lazy(() => import('../../../Components/AdminSide/Navbar/AdminNavBar'));
const AsideBar = React.lazy(() => import('../../../Components/AdminSide/AsideBar/AsideBar'));
const TheaterComp = React.lazy(() => import('../../../Components/StaffSide/Theater/Theater'));

function TheaterPage() {


  let email;
  try {
    const RefreshToken = JSON.parse(localStorage.getItem('RefreshToken'));
    const decodeRefresh = jwtDecode(RefreshToken);
    email = decodeRefresh.user_cred;
    console.log('the user email is ', email);
  } catch (error) {
    console.log('the error', error);
  }

  const [theater, setTheater] = useState([]);
  const [showTheater, setShowTheater] = useState(false);

  const fetchTheaters = async () => {
    try {
      const resp = await axios.get(`/theater/TheaterApiListCreateAPIView/`);
      setTheater(resp.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, [showTheater]);


  const deleteTheater = async (id) => {
    try {
      const resp = await axios.delete(`/theater/TheaterApiRetrieveUpdateDestroyAPIView/${id}/`);
      fetchTheaters();
    } catch (error) {
    }
  };

  const ApproveStatus =async(id)=> {
    try{
      const resp = await axios.put(`/theater/TheaterPutClassApi/${id}/`)
      if(resp.status === 200){
        toast.success("Theater is approved")
        fetchTheaters();
      }
    }catch(error){
      console.log(error)
    }
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className="theater-page__container">
        <AsideBar />
        <NavBar />
        {/* <button onClick={() => setShowTheater(!showTheater)} className="theater-page__create-btn">
          {showTheater ? 'CLOSE CREATE THEATER' : 'CREATE THEATER'}
        </button> */}
        {showTheater && <TheaterComp />}
        <div className="theater-page__content">
          <div className="theater-page__theater-list">
            {theater.map((theater) => (
              <div className="theater-page__theater-card" key={theater.id}>
                <div className={`theater-page__theater-header ${theater.theater_status}`}>
                  <h3>{theater.theater_name}</h3>
                </div>
                <div className="theater-page__details">
                  <p><strong>Email:</strong> {theater.email}</p>
                  <p><strong>Phone:</strong> {theater.phone}</p>
                  <p><strong>Address:</strong> {theater.address}</p>
                  <p><strong>City:</strong> {theater.city}</p>
                  <p><strong>State:</strong> {theater.state}</p>
                  <p><strong>Theater Status:</strong> {theater.theater_status}</p>
                </div>
                <div className="theater-page__actions">
                  <button className="theater-page__delete-btn" onClick={() => deleteTheater(theater.id)}>
                    Delete
                  </button>
                  {theater.theater_status === 'PENDING' ? 
                  <button className="theater-page__approve-btn" onClick={() => ApproveStatus(theater.id)}>
                    APPROVE
                  </button>
                  : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Suspense>
  );
}

export default TheaterPage;
