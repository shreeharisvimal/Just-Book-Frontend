import {jwtDecode} from 'jwt-decode';
import axios from '../axios';

const createNewToken = async () => {
    const refreshToken = localStorage.getItem('RefreshToken');
    if (!refreshToken) {
        return false;
    }

    try {
        const response = await axios.post('token/refresh/', { refresh: refreshToken });
        if (response.status === 200) {
            const { access, refresh } = response.data;
            localStorage.setItem('AccessToken', access);
            localStorage.setItem('RefreshToken', refresh);
            const decodedAccessToken = jwtDecode(access);
            return { name: decodedAccessToken.first_name, isAuthenticated: true };
        }
    } catch (error) {
        console.error('Error in createNewToken:', error);
    }
    return false;
};

const checkAdmin = async () => {
    const accessToken = localStorage.getItem('AccessToken');
    try {
        const response = await axios.get('/', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json', 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error in checkAdmin:', error);
        return false;
    }
};

const authAdmin = async () => {
    const accessToken = localStorage.getItem('AccessToken');
    const refreshToken = localStorage.getItem('RefreshToken');

    if (!accessToken) {
        return {
            first_name: null,
            isAuthenticated: false,
            isAdmin: false,
            is_staff: false,
        };
    }

    const currentTime = Date.now() / 1000;
    let decodedAccessToken;
    let decodedRefreshToken;

    try {
        decodedAccessToken = jwtDecode(accessToken);
        decodedRefreshToken = jwtDecode(refreshToken);
    } catch (error) {
        console.error('Error decoding tokens:', error);
        return {
            first_name: null,
            isAuthenticated: false,
            isAdmin: false,
            is_staff: false,
        };
    }

    if (decodedAccessToken.exp > currentTime) {
        const adminStatus = await checkAdmin();
        return {
            first_name: decodedAccessToken.first_name,
            user_cred: decodedAccessToken.user_cred,
            isAuthenticated: true,
            isAdmin: adminStatus.is_superuser,
            is_staff: adminStatus.is_staff,
        };
    }

    const newToken = await createNewToken();
    if (newToken) {
        const updatedAccessToken = localStorage.getItem('AccessToken');
        const updatedDecodedAccessToken = jwtDecode(updatedAccessToken);
        const adminStatus = await checkAdmin();
        return {
            first_name: updatedDecodedAccessToken.first_name,
            user_cred: updatedDecodedAccessToken.user_cred,
            isAuthenticated: true,
            isAdmin: adminStatus.is_superuser,
            is_staff: adminStatus.is_staff,
        };
    }

    return {
        first_name: null,
        isAuthenticated: false,
        isAdmin: false,
        is_staff: false,
    };
};

export default authAdmin;
