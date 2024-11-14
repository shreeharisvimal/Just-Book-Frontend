import React, { useEffect, useState } from 'react';
import './SeatType.scss';
import axios from '../../../Admin_axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const WarningBox = React.lazy(()=> import('../../../Utils/WarningBox'));
const AsideBar = React.lazy(() => import('../../../Components/StaffSide/AsideBar/AsideBar'));
const NavBar = React.lazy(() => import('../../../Components/StaffSide/Navbar/AdminNavBar'));

function SeatTypePage() {
  const user = useSelector((state) => state.auth_user);
  const [theater, setTheater] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [apiLink, setApiLink] = useState('');
  const [onOpen, setOnOpen] = useState('');
  const [onSuccess, setOnSuccess] = useState(false)

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
        const theaterId = TheaterResp.data && TheaterResp.data.length > 0 && TheaterResp.data[0].id
        ? TheaterResp.data[0].id
        : '0';
        setFormData((data) => ({ ...data, theater: theaterId }));
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
    if (onSuccess) {
      toast.dismiss();
      toast.success("Screen Type deleted successfully");
      setOnSuccess(false);
    }
    FetchTheater();
    FetchSeatTypes();
  }, [showCreate, onSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!FormData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!FormData.price_multi || isNaN(FormData.price_multi) || Number(FormData.price_multi) <= 0) {
      toast.error("Please enter a valid positive number for Price Multiplier");
      return;
    }

    try {
      const response = await axios.post('/theater/SeatTypeCreateApi/', FormData);
      if (response.status === 201) {
        toast.success("Seat Type is created successfully");
        setFormData(INIT_STATE);
        setShowCreate(false)
        FetchSeatTypes();
      }
    } catch (error) {
      console.error('There was an error creating the seat type!', error);
      toast.error("Error creating seat type");
    }
  };

  const HandleDelete = async (id) => {
    toast.loading("Deleting SeatType...");
    try {
      setApiLink(`/theater/SeatTypeDeleteApi/${id}/`)
      setOnOpen(true)
    } catch (error) {
      console.error('There was an error deleting the seat type!', error);
      toast.error("Error deleting seat type");
    }
  };

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <AsideBar />
       {onOpen && <WarningBox apiLink={apiLink} setOnOpen={setOnOpen} setOnSuccess={setOnSuccess}/> }
      <div className='SeatType__container'>
        <button className='SeatType__toggle-btn' onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Close Creating' : 'Create Seat Type'}
        </button>
        {showCreate ? (
          <div className='SeatType__form-container'>
            <h1 className='SeatType__title'>Create Seat Type</h1>
            <form className='SeatType__form' onSubmit={handleSubmit}>
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
                    <p>Price Multiplier: {seatType.price_multi} %</p>
                  </div>
                  <button onClick={() => HandleDelete(seatType.id)}>Delete</button>
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
