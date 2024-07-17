import React, { useState } from 'react';
import './Login.scss';
import axios from '../../../axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { set_Authenticate } from '../../../Redux/Auth/AuthSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLogindata] = useState({
    email: '',
    password: ''
  });

  const HandleOnChange = (e) => {
    setLogindata({ ...loginData, [e.target.name]: e.target.value });
  };

  const HandleOnSubmit = async (e) => {
    e.preventDefault();
    console.log(loginData);
    let passwordLength = loginData.password ? loginData.password.trim().length : 0;
    let emailLength = loginData.email ? loginData.email.trim().length : 0;

    let valueToSet = {};
    if (passwordLength >= 4 && emailLength > 7) {
      valueToSet = { password: loginData.password.trim(), email: loginData.email.trim() };
      try {
        const response = await axios.post('/AdminAuth/', valueToSet);
        console.log(response.data);
        if (response.status === 200) {
          console.log(response.data);
          if (!response.data.isAdmin && !response.data.is_staff) {
            toast.warning('You are not authorized to login.');
            navigate('/admin/');
            return;
          }
          if (response.data.access_token && response.data.refresh_token) {
            try {
              localStorage.setItem('user_cred', response.data.access_token['user_cred']);
              localStorage.setItem('first_name', response.data.first_name);
              localStorage.setItem('AccessToken', response.data.access_token);
              localStorage.setItem('RefreshToken', response.data.refresh_token);

              const decodeRefresh = jwtDecode(response.data.refresh_token);
              dispatch(
                set_Authenticate({
                  first_name: decodeRefresh.first_name,
                  user_cred: decodeRefresh.user_cred,
                  isAuth: true,
                  isAdmin: response.data.isAdmin,
                  is_staff:response.data.is_staff,
                })
              );
              if (response.data.is_staff && !response.data.isAdmin){
                navigate('staffDashboard/')
              }else if(response.data.isAdmin){
                navigate('DashBoard/');
              }
            } catch (err) {
              console.log('error in the access token', err);
            }
          }
        } else {
          console.log("the error not in values set", response.data);
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error during login:', error.response ? error.response.data : error.message);
      }
    } else {
      console.error('Invalid email or password length');
      toast.error('Invalid email or password length');
    }
  };

  return (
    <div className="login__container">
      <h2 className="login__title">Admin Panel Login</h2>
      <form onSubmit={HandleOnSubmit}>
        <div className="login__form-group">
          <label htmlFor="email" className="login__label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={loginData.email}
            onChange={HandleOnChange}
            className="login__input"
            required
          />
        </div>
        <div className="login__form-group">
          <label htmlFor="password" className="login__label">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            onChange={HandleOnChange}
            className="login__input"
            required
          />
        </div>
        <button type="submit" className="login__button">Login</button>
      </form>
    </div>
  );
}

export default Login;
