import React, { useEffect, useState } from 'react';
import './TheaterPage.scss';
import axios from '../../../Admin_axios';
import {jwtDecode} from 'jwt-decode';
import 'react-phone-input-2/lib/style.css';

const NavBar = React.lazy(() => import('../../../Components/StaffSide/Navbar/AdminNavBar'));
const AsideBar = React.lazy(() => import('../../../Components/StaffSide/AsideBar/AsideBar'));
const TheaterComp = React.lazy(() => import('../../../Components/StaffSide/Theater/Theater'));

function TheaterPage() {
  const CITY = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
    "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur",
    "Visakhapatnam", "Indore", "Kochi", "Trivandrum", 'Alappuzha',
  ];
  const [showEdit, setShowEditTheater] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  let email;
  const INIT_STATE = {
    theater_name: '',
    email: email,
    phone: '',
    address: '',
    city: '',
    state: '',
    description: '',
  };
  const [formData, setFormData] = useState(INIT_STATE);
  const [theaterId, setTheaterId] = useState(null);

 

  const [theater, setTheater] = useState([]);
  const [showTheater, setShowTheater] = useState(false);

  const fetchTheaters = async () => {
    try {
      const RefreshToken = localStorage.getItem('RefreshToken');
      const decodeRefresh = jwtDecode(RefreshToken);
      email = decodeRefresh.user_cred;
      console.log('the user email is ', email);
    } catch (error) {
      console.log('the error', error);
    }
    try {
      const resp = await axios.get(`/theater/FetchTheaterStaff/${email}/`);
      console.log('the theater', resp.data);
      setTheater(resp.data);
    } catch (error) {
      console.error('Error fetching theaters:', error);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, [showTheater]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const editTheater = (theater) => {
    setFormData({
      theater_name: theater.theater_name,
      email: theater.email,
      phone: theater.phone,
      address: theater.address,
      city: theater.city,
      state: theater.state,
      description: theater.description,
    });
    setTheaterId(theater.id);
    setEditMode(true);
    setShowEditTheater(true);
  };

  const deleteTheater = async (id) => {
    try {
      await axios.delete(`/theater/TheaterApiRetrieveUpdateDestroyAPIView/${id}/`);
      fetchTheaters();
    } catch (error) {
      console.error('Error deleting theater:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`/theater/TheaterApiRetrieveUpdateDestroyAPIView/${theaterId}/`, formData);
        setEditMode(false);
      } else {
        await axios.post('/theater/TheaterApiRetrieveUpdateDestroyAPIView/', formData);
      }
      fetchTheaters();
      setShowEditTheater(false);
      setFormData(INIT_STATE);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className="theater-page__container">
        <AsideBar />
        <NavBar />
        <button onClick={() => setShowTheater(!showTheater)} className="theater-page__create-btn">
          {showTheater ? 'CLOSE CREATE THEATER' : 'CREATE THEATER'}
        </button>
        {showTheater && <TheaterComp setShowTheater={setShowTheater} />}
        <div className="theater-page__content">
          <div className="theater-page__theater-list">
            {theater.map((theater) => (
              <div className="theater-page__theater-card" key={theater.id}>
                <div className={`theater-page__theater-header ${theater.theater_status}`}>
                  <h3>{theater.theater_name.toUpperCase()}</h3>
                </div>
                <div className="theater-page__details">
                  <p><strong>Email:</strong> {theater.email}</p>
                  <p><strong>Phone:</strong> {theater.phone}</p>
                  <p><strong>Address:</strong> {theater.address}</p>
                  <p><strong>City:</strong> {theater.city}</p>
                  <p><strong>State:</strong> {theater.state}</p>
                  <p><strong>Description:</strong> {theater.description}</p>
                  <p><strong>Theater Status:</strong> {theater.theater_status}</p>
                </div>
                <div className="theater-page__actions">
                  <button className="theater-page__delete-btn" onClick={() => deleteTheater(theater.id)}>
                    Delete
                  </button>
                  <button className="theater-page__edit-btn" onClick={() => editTheater(theater)}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
          {showEdit && (
            <form onSubmit={handleSubmit} className="form">
              <h2 className="form-title">{editMode ? 'Edit Theater' : 'Add Theater'}</h2>
              <input
                type="text"
                name="theater_name"
                value={formData.theater_name}
                placeholder="Theater Name"
                onChange={handleChange}
                className="form-input"
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
              <input
                type="text"
                name="address"
                value={formData.address}
                placeholder="Address"
                onChange={handleChange}
                className="form-input"
              />
            
              {errors.city && <p className="error-text">{errors.city}</p>}
              <input
                type="text"
                name="state"
                value={formData.state}
                placeholder="State"
                onChange={handleChange}
                className="form-input"
              />
              {errors.state && <p className="error-text">{errors.state}</p>}
              <textarea
                name="description"
                value={formData.description}
                placeholder="Description"
                onChange={handleChange}
                className="form-textarea"
              />
              <button type="submit" onClick={handleSubmit} className="form-button">Submit</button>
      <button type="submit" onClick={()=>setShowEditTheater(false)} className="form-button">Cancel</button>
            </form>
          )}
        </div>
      </div>
    </React.Suspense>
  );
}

export default TheaterPage;
