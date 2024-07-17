import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Image from '../../../logo192.png';
import UserAuthCard from '../UserAuthCard/UserAuthCard';
import styles from './Navbar.module.scss'; // Use the correct path and module extension
import isAuthUser from '../../../Utils/AuthUser';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import { set_Authenticate } from '../../../Redux/Auth/AuthSlice';
import { set_Location } from '../../../Redux/Location/Location'; // Import set_Location action

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [callAutoLocation, setAutoLocation] = useState(false);
    const [isLoginOrSigninVisible, setIsLoginOrSigninVisible] = useState(false);
    const AuthUser = useSelector((state) => state.auth_user);
    const Location = useSelector((state) => state.location_details);

    const INIT_STATE = [
        "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
        "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur",
        "Visakhapatnam", "Indore", "Kochi", "Trivandrum", 'Alappuzha',
    ];

    useEffect(() => {
        if (navigator.geolocation && !localStorage.getItem('city')) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    getCityName(latitude, longitude);
                }
            );
        } else {
            setLocationFromLocalStorage();
        }
    }, [callAutoLocation]);

    const getCityName = async (latitude, longitude) => {
        const apiKey = 'a78b83f46e89488180ff7b8f3a72ff6a';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data.results.length > 0) {
                const components = data.results[0].components;
                const city = components.city || components.town || components.village || 'City not found';
                dispatch(set_Location(city));
                localStorage.setItem('city', city);
            } else {
                console.log('No address found for this location.');
            }
        } catch (error) {
            console.log('Error fetching the address:', error);
        }
    };

    const setLocationFromLocalStorage = () => {
        const storedCity = localStorage.getItem('city');
        if (storedCity) {
            dispatch(set_Location(storedCity));
        }
    };

    const toggleLoginOrSignin = () => {
        setIsLoginOrSigninVisible(!isLoginOrSigninVisible);
    };

    useEffect(() => {
        if (AuthUser.first_name) {
            setIsLoginOrSigninVisible(false);
        }
    }, [AuthUser.first_name]);

    useEffect(() => {
        const AccessToken = localStorage.getItem('AccessToken');
        if (AccessToken) {
            try {
                const decodedToken = jwtDecode(AccessToken);
                if (decodedToken.exp > Date.now() / 1000) {
                    dispatch(
                        set_Authenticate({
                            first_name: decodedToken.first_name,
                            user_cred: decodedToken.user_cred,
                            isAuth: true,
                            isAdmin: decodedToken.isAdmin,
                        })
                    );
                } else {
                    isAuthUser();
                }
            } catch (error) {
                console.error('Error decoding access token:', error);
            }
        }
    }, [dispatch]);

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        if (selectedCity === 'Auto Select') {
            localStorage.removeItem('city');
            setAutoLocation(true);
        } else {
            setAutoLocation(false);
            dispatch(set_Location(selectedCity));
            localStorage.setItem('city', selectedCity);
        }
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.navbar__logo}>
                <img onClick={() => navigate('/')} className={styles.navbar__logo_img} src={Image} alt="Logo" />
            </div>
            <div className={styles.navbar__search}>
                <input className={styles.navbar__search_bar} type="text" placeholder='Enter Movie Name or Shows' />
                <button className={styles.navbar__search_button}>Search</button>
            </div>
            <div className={styles.navbar__dropdown}>
                <select className={styles.navbar__dropdown_select} value={Location.city || 'Please wait'} onChange={handleCityChange}>
                    <option>{Location.city}</option>
                    <option value="Auto Select">Auto Select</option>
                    {INIT_STATE.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                    ))}
                </select>
            </div>
            <div className={styles.navbar__auth}>
                {AuthUser.first_name ? (
                    <Link to='/profile' className={styles.navbar__auth_button}>
                        {AuthUser.first_name}
                    </Link>
                ) : (
                    <button className={styles.navbar__auth_button} onClick={toggleLoginOrSignin}>
                        SignIn / SignUp
                    </button>
                )}
                {isLoginOrSigninVisible && <UserAuthCard />}
            </div>
        </div>
    );
}

export default Navbar;
