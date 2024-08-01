import React, { useState } from 'react';
import './Theater.scss';
import axios from '../../../Admin_axios';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function Theater({setShowTheater}) {
  const CITY = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
    "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur",
    "Visakhapatnam", "Indore", "Kochi", "Trivandrum", 'Alappuzha',
  ];
  const user = useSelector((state)=> state.auth_user)
  const INIT_STATE = {
    theater_name: '',
    email:user.user_cred ,
    phone: '',
    address: '',
    city: '',
    state: '',
    description: '',
  };

  const [formData, setFormData] = useState(INIT_STATE);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.theater_name) formErrors.theater_name = "Theater name is required";
    if (!formData.email) formErrors.email = "Email is required";
    if (!formData.phone) formErrors.phone = "Phone number is required";
    if (!formData.address) formErrors.latitude = "Address is required";
    if (!formData.city) formErrors.latitude = "city is required";
    if (!formData.state) formErrors.latitude = "state is required";
    if (!formData.description) formErrors.longitude = "description is required";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    try {
      const res = await axios.post('/theater/TheaterApiListCreateAPIView/', formData);
      if (res.status === 201 || res.status === 200) {
        toast.success('Successfully created a Theater');
        setFormData(INIT_STATE);
        setShowTheater(false)
        setErrors({})
      }
      else if(res.status === 226){
        toast.error('Theater already exists')
      } else {
        toast.error('Failed to create Theater');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title">Add Theater</h2>

        <input
          type="text"
          name="theater_name"
          value={formData.theater_name}
          placeholder="Theater Name"
          onChange={handleChange}
          className="form-input"
        />
        {errors.theater_name && <p className="error-text">{errors.theater_name}</p>}

        <PhoneInput
          country={'in'}
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          inputProps={{
            name: 'phone',
            required: true,
          }}
          placeholder="Enter contact"
          inputStyle={{ width: '90%', padding: '10px' }}
        />
        {errors.phone && <p className="error-text">{errors.phone}</p>}

        <input
          type="text"
          name="address"
          value={formData.address}
          placeholder="address"
          onChange={handleChange}
          className="form-input"
        />
        {errors.address && <p className="error-text">{errors.address}</p>}
        <select
          className='form-Drop'
          name='city'
          value={formData.city}
          onChange={handleChange}
        >
          <option value="">Select City</option>
          {CITY.map((city, index) => (
            <option key={index} value={city}>{city}</option>
          ))}
        </select>
       
        {errors.city && <p className="error-text">{errors.city}</p>}

        <input
          type="text"
          name="state"
          value={formData.state}
          placeholder="state"
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
      </form>
    </div>
  );
}

export default Theater;
