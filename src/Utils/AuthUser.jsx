import {jwtDecode} from 'jwt-decode';
import axios from '../axios';

const updateUserToken = async () => {
    const refreshToken = localStorage.getItem('AccessToken');
    if (!refreshToken) {
        return { name: null, isAuthenticated: false };
    }

    try {
        const response = await axios.post('token/refresh/', { refresh: refreshToken });
        if (response.status === 200) {
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('AccessToken',(access_token));
            localStorage.setItem('RefreshToken', (refresh_token));
            const decodedAccessToken = jwtDecode(access_token);
            localStorage.setItem('user_id', (decodedAccessToken['user_id']));
            return { name: decodedAccessToken.first_name, isAuthenticated: true };
        }
    } catch (error) {
        console.error('Error in updateUserToken:', error);
    }
    return { name: null, isAuthenticated: false };
};

const isAuthUser = async () => {
    const accessToken = localStorage.getItem('AccessToken');
    if (!accessToken) {
        return { name: null, isAuthenticated: false };
    }

    const currentTime = Date.now() / 1000;
    let decodedAccessToken;

    try {
        decodedAccessToken = jwtDecode(accessToken);
    } catch (error) {
        console.error('Error decoding access token:', error);
        return { name: null, isAuthenticated: false };
    }

    if (decodedAccessToken.exp > currentTime) {
        return { name: decodedAccessToken.first_name, isAuthenticated: true };
    }
    else{
        localStorage.removeItem('AccessToken')
    }

    const updatedToken = await updateUserToken();
    return updatedToken;
};

export default isAuthUser;
