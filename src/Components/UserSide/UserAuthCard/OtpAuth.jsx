import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { set_Authenticate } from '../../../Redux/Auth/AuthSlice';
import {jwtDecode} from 'jwt-decode';
import './otp.scss';
import './myOTP.css'

function OtpAuth({ userdata, otpres }) {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
    setErrorMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!otpres) {
        console.error('OTP response is null.');
        return; 
      }

      console.log('The response for OTP:', otpres);

      if (otpres.otp) {
        const otpFromServer = otpres.otp;
        if (String(otpFromServer) === otp) {
          console.log('OTP Verified!');
          toast.success('OTP verification successful');
          if (userdata.access_token && userdata.refresh_token) {
            try {
              localStorage.setItem('user_cred', JSON.stringify(userdata.user_cred));
              localStorage.setItem('first_name', JSON.stringify(userdata.first_name));
              localStorage.setItem('AccessToken', userdata.access_token);
              const decodedToken = jwtDecode(userdata.access_token);
              dispatch(
                set_Authenticate({
                  first_name: decodedToken.first_name,
                  user_cred: userdata.user_cred,
                  isAuth: true,
                  isAdmin: userdata.isAdmin,
                })
              );
            } catch (error) {
              console.error('Error decoding token:', error);
            }
          } else {
            console.error('Access token or refresh token missing in response');
          }
        } else {
          setErrorMessage("Invalid OTP. Please try again.");
        }
      } else {
        console.error('Failed to retrieve OTP from the server.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Error verifying OTP');
    }
  };

  return (
    <div className="containerotp">
      <h1>OTP Login</h1>
      <form id="otp-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            name="otp"
            maxLength="6"
            placeholder="000 000"
            required
            value={otp}
            onChange={handleOtpChange}
          />
        </div>
        <button className="btn" type="submit"> Verify OTP</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <br />
    </div>
  );
}

export default OtpAuth;
