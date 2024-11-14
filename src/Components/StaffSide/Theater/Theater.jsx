import React, { useState } from 'react';
import './Theater.scss';
import axios from '../../../Admin_axios';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function Theater({ setShowTheater }) {
  const CITY = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
    "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur",
    "Visakhapatnam", "Indore", "Kochi", "Trivandrum", "Alappuzha",
  ];

  const user = useSelector((state) => state.auth_user);
  const INIT_STATE = {
    theater_name: '',
    email: user?.user_cred || '',
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.theater_name.trim()) formErrors.theater_name = "Theater name is required";
    if (!formData.email.trim()) formErrors.email = "Email is required";
    if (!formData.phone.trim()) formErrors.phone = "Phone number is required";
    if (!formData.address.trim()) formErrors.address = "Address is required";
    if (!formData.city.trim()) formErrors.city = "City is required";
    if (!formData.state.trim()) formErrors.state = "State is required";
    if (!formData.description.trim()) formErrors.description = "Description is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      formErrors.email = "Enter a valid email";
    }

    const phoneRegex = /^(?:\+?(\d{1,3})[-.\s]?)?(\d{5})[-.\s]?(\d{5})$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      formErrors.phone = "Enter a valid 10-digit phone number";
    }

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
        setShowTheater(false);
        setErrors({});
      } else if (res.status === 226) {
        toast.error('Theater already exists');
      } else {
        toast.error('Failed to create Theater');
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error('An error occurred while creating the Theater');
    }
  };

  return (
    <div className="TheaterCompcontainer">
      <form onSubmit={handleSubmit} className="TheaterCompform">
        <h2 className="TheaterCompform__title">Add Theater</h2>

        <input
          type="text"
          name="theater_name"
          value={formData.theater_name}
          placeholder="Theater Name"
          onChange={handleChange}
          className="TheaterCompform__input"
        />
        {errors.theater_name && <p className="error-text">{errors.theater_name}</p>}

        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          className="TheaterCompform__input"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <PhoneInput
          country={'in'}
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          inputProps={{
            name: 'phone',
            required: true,
          }}
          placeholder="Enter contact"
          inputStyle={{ padding: '10px', width: '80%' }}
          className="TheaterCompform__input"
        />
        {errors.phone && <p className="error-text">{errors.phone}</p>}

        <input
          type="text"
          name="address"
          value={formData.address}
          placeholder="Address"
          onChange={handleChange}
          className="TheaterCompform__input"
        />
        {errors.address && <p className="error-text">{errors.address}</p>}

        <select
          className="TheaterCompform__drop"
          name="city"
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
          placeholder="State"
          onChange={handleChange}
          className="TheaterCompform__input"
        />
        {errors.state && <p className="error-text">{errors.state}</p>}

        <textarea
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
          className="TheaterCompform__textarea"
        />
        {errors.description && <p className="error-text">{errors.description}</p>}

        <button type="submit" className="TheaterCompform__button">Submit</button>
      </form>
    </div>
  );
}

export default Theater;
