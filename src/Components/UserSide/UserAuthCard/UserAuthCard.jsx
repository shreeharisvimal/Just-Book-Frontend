import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../../axios';
import OtpAuth from './OtpAuth';
import './UserAuth.scss';
import './auth.css'

function UserAuthCard() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showOtpAuth, setShowOtpAuth] = useState(false);
  const [userdata, setUserdata] = useState(null);
  const [otpres, setOtpres] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'phone') {
      setPhone(value);
    } else if (name === 'email') {
      setEmail(value);
    }
  };

  const handleUserAuth = async (event) => {
    event.preventDefault();

    let phoneLength = phone ? phone.trim().length : 0;
    let emailLength = email ? email.trim().length : 0;

    let valueToSet = {};

    if (phoneLength > emailLength) {
      valueToSet = { phone: phone.trim() };
    } else {
      valueToSet = { email: email.trim() };
    }

    try {
      const res = await axios.post('SignInOrUp/', valueToSet);
      if (res.status === 200) {
        const userdata = res.data.userdata;
        console.log("The use date", userdata)
        setUserdata(userdata);

        toast.loading(`Please check your ${email ? 'email inbox' : 'You will Be having a call from our side'} for the OTP`);
        
        let otpResponse;
        if (phoneLength > emailLength) {
          otpResponse = await axios.get(`getLoginOtp/+91${valueToSet.phone}/`);
        } else {
          otpResponse = await axios.get(`getLoginOtp/${valueToSet.email}/`);
        }

        if (otpResponse.status === 200) {
          setOtpres(otpResponse.data);
          setShowOtpAuth(true);
        } else {
          throw new Error('Failed to retrieve OTP');
        }

        setInterval(()=>{
          toast.dismiss();
        },3000)
      }
    } catch (error) {
      console.error('Request error:', error);
      toast.dismiss();
    }
  };

  return (
    <div className="container">
      {showOtpAuth ? (
        <OtpAuth userdata={userdata} otpres={otpres} />
      ) : (
        <form onSubmit={handleUserAuth}>
          <div>
            <input 
              type="text" 
              name="phone" 
              value={phone} 
              onChange={handleChange} 
              placeholder="Enter Phone Number" 
              disabled={!!email} 
            />
          </div> 
          <div className="or">OR</div>
          <div>
            <input 
              type="email" 
              name="email" 
              value={email} 
              onChange={handleChange} 
              placeholder="Enter Email" 
              disabled={!!phone} 
            />
          </div>
          <button type="submit" className="bton">SignIn Or SignUp</button>
        </form>
      )}
      <br />
      <span className="Info">Even If You Are a New User or Not Just We Only Need The Mail Or Phone To Continue</span>
      <span className="svg">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="30" viewBox="0 0 50 50">
          <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"></path>
        </svg>
      </span>
    </div>
  );
}

export default UserAuthCard;
