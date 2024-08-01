import React, { useEffect, useState } from 'react';
import './Screen.scss';
import axios from '../../../Admin_axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function Screen({setShowCreate}) {
  const INIT_STATE = {
    name: '',
    theater: '',
    total_seats: null,
    screen_type: '',
  };

  const user = useSelector((state)=> state.auth_user)

  const [newScreen, setNewScreen] = useState(INIT_STATE);
  const [ScreenTypes, setScreeTypes] = useState([]);
  const [Theaters, setTheaters] = useState([]);

  const FetchTheaterScreenType = async () => {
    try {
      toast.loading('Fetching Theaters And Screen Types');
      const TheaterResp = await axios.get(`theater/FetchTheaterStaff/${user.user_cred}/` );
      const ScreenTypeResp = await axios.get('theater/ScreenTypeApiCreate/');
      console.log(TheaterResp, ScreenTypeResp);
      if (TheaterResp.status === 200) {
        if (ScreenTypeResp.status === 200) {
          setScreeTypes(ScreenTypeResp.data);
          setTheaters(TheaterResp.data);
          toast.dismiss();
        }
      }
    } catch (error) {
      console.log('An error have been found', error);
    }
  };

  useEffect(() => {
    FetchTheaterScreenType();
  }, []);

  const handleInputChange = (event) => {
    const { value, name } = event.target;
      setNewScreen({ ...newScreen, [name]: value });

  };

  const FormValidata = () => {
    for (let key in newScreen) {
      if (newScreen[key].trim() === '') {
        toast.warning('Please fill out every field');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const FormValidateResp = FormValidata();
      if (FormValidateResp === true) {
        const resp = await axios.post('/theater/ScreenApiCreate/', newScreen);
        if (resp.status === 201) {
          setNewScreen(INIT_STATE);
          setShowCreate(false)
          toast.success('Screen created successfully');
        }
      }
    } catch (error) {
      console.log('An error have been found');
    }
  };

  return (
    <div className="screen">
      <form className="screen__form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Screen Name"
          value={newScreen.name}
          onChange={handleInputChange}
          className="screen__form__input"
        />
        <select
          name="theater"
          value={newScreen.theater}
          onChange={handleInputChange}
          className="screen__form__select"
        >
          <option value="">Select Theater</option>
          {Theaters.map((theater) => (
            theater.theater_status === 'APPROVED' ? (
              <option key={theater.id} value={theater.id}>
                {theater.theater_name}
              </option>
            ) : null
          ))}
        </select>
        <input
          type="number"
          name="total_seats"
          placeholder="Total Seats"
          value={newScreen.total_seats}
          onChange={handleInputChange}
          className="screen__form__input"
        />
        <select
          name="screen_type"
          value={newScreen.screen_type}
          onChange={handleInputChange}
          className="screen__form__select"
        >
          <option value="">Select Screen Type</option>
          {ScreenTypes.map((screenType) => (
            <option key={screenType.id} value={screenType.id}>
              {screenType.name}
            </option>
          ))}
        </select>
        <button type="submit" className="screen__form__button">
          Add Screen
        </button>
      </form>
    </div>
  );
}

export default Screen;
