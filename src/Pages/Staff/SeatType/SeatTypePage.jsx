import React, { useEffect, useState } from 'react';
import './SeatType.scss';
import axios from '../../../Admin_axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AsideBar = React.lazy(() => import('../../../Components/StaffSide/AsideBar/AsideBar'));
const NavBar = React.lazy(() => import('../../../Components/StaffSide/Navbar/AdminNavBar'));

function SeatTypePage() {
  const user = useSelector((state) => state.auth_user);
  const [theater, setTheater] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const INIT_STATE = {
    theater: null,
    name: '',
    price_multi: '',
  };

  const [FormData, setFormData] = useState(INIT_STATE);

  const HandleChange = (e) => {
    const { name, value } = e.target;
    try {
      setFormData({ ...FormData, [name]: value });
    } catch (error) {
      console.log(error);
    }
  };

  const FetchTheater = async () => {
    toast.loading("Fetching Theaters");
    try {
      const TheaterResp = await axios.get(`theater/FetchTheaterStaff/${user.user_cred}/`);
      if (TheaterResp.status === 200) {
        setTheater(TheaterResp.data);
        toast.dismiss();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const FetchSeatTypes = async () => {
    toast.loading("Fetching Seat Types");
    try {
      const SeatTypeResp = await axios.get(`theater/SeatTypeFetch/`);
      if (SeatTypeResp.status === 200) {
        setSeatTypes(SeatTypeResp.data);
        toast.dismiss();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchTheater();
    FetchSeatTypes();
  }, [showCreate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/theater/SeatTypeCreateApi/', FormData);
      if (response.status === 201) {
        toast.success("Seat Type is created successfully");
        setFormData(INIT_STATE);
        FetchSeatTypes();
      }
    } catch (error) {
      console.error('There was an error creating the seat type!', error);
    }
  };

  const HandleDelete=async(id)=>{
    try{
      const response = await axios.delete(`/theater/SeatTypeDeleteApi/${id}/`);
      if (response.status === 204){
        toast.warning("Seat Type is deleted successfully");
        FetchSeatTypes();
      }
    }catch(error){
      console.error('There was an error deleting the seat type!', error);
    }
  };

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className='SeatType__container'>
        <NavBar />
        <AsideBar />
        <button className='SeatType__toggle-btn' onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Close Creating' : 'Create Seat Type'}
        </button>
        {showCreate ? (
          <div className='SeatType__form-container'>
            <h1 className='SeatType__title'>Create Seat Type</h1>
            <form className='SeatType__form' onSubmit={handleSubmit}>
              <div className='SeatType__form-group'>
                <select
                  name='theater'
                  value={FormData.theater}
                  onChange={HandleChange}
                  required
                >
                  <option value="">Select A Theater</option>
                  {theater.map((theater) => (
                    <option key={theater.id} value={theater.id}>
                      {theater.theater_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='SeatType__form-group'>
                <label htmlFor='name' className='SeatType__label'>Name</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  className='SeatType__input'
                  value={FormData.name}
                  onChange={HandleChange}
                  required
                />
              </div>
              <div className='SeatType__form-group'>
                <label htmlFor='priceMulti' className='SeatType__label'>Price Multiplier</label>
                <input
                  type='text'
                  id='priceMulti'
                  className='SeatType__input'
                  name='price_multi'
                  value={FormData.price_multi}
                  onChange={HandleChange}
                  required
                />
              </div>
              <button type='submit' className='SeatType__button'>Create</button>
            </form>
          </div>
        ) : (
          <div className='SeatType__list-container'>
            <h1 className='SeatType__title'>Seat Types</h1>
            <ul className='SeatType__list'>
              {seatTypes.map((seatType) => (
                <li key={seatType.id} className='SeatType__item'>
                  <div className='SeatType__item-info'>
                    <h2>Seat Type :{seatType.name}</h2>
                    <h4>Theater name : {seatType.theater.theater_name}</h4>
                    <p>Price Multiplier: {seatType.price_multi} %</p>
                  </div>
                    <button onClick={()=>HandleDelete(seatType.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </React.Suspense>
  );
}

export default SeatTypePage;
