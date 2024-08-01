import React, { lazy, useEffect, useCallback } from 'react';
import AdminPrivateRouter from './AdminPrivateRouter';
import StaffPrivateRouter from './StaffPrivateRouter';
import { useSelector, useDispatch } from 'react-redux';
import AuthAdmin from '../Utils/AuthAdmin';
import { set_Authenticate } from '../Redux/Auth/AuthSlice';
import { Route, Routes } from 'react-router-dom';
import axios from '../axios';
import { get_UserDetails } from '../Redux/User/UserSlice';

const MoviePage = lazy(() => import('../Pages/Admin/Movie/MoviePage'));
const TheaterPage = lazy(() => import('../Pages/Staff/Theater/TheaterPage'));
const ScreenPage = lazy(() => import('../Pages/Staff/Screen/Screen'));
const Genres = lazy(() => import('../Pages/Admin/Movie/Genre/Genre'));
const Language = lazy(() => import('../Pages/Admin/Movie/Language/Language'));
const ScreenType = lazy(() => import('../Pages/Staff/Screen/ScreenType/ScreenType'));
const StaffManagement = lazy(() => import('../Pages/Admin/Staff/Staff'));
const AdminTheaterPage = lazy(()=> import('../Pages/Admin/Theater/TheaterPage'))
const ShowPage = lazy(()=> import('../Pages/Staff/show/ShowPage'))
const SeatTypePage = lazy(()=> import('../Pages/Staff/SeatType/SeatTypePage'))
const SeatingPage = lazy(()=> import('../Pages/Staff/Seats/Seats'))


function AdminWrapper() {
    const dispatch = useDispatch();
    const { first_name, isAuthenticated } = useSelector((state) => state.auth_user);

    const authCheck = useCallback(async () => {
        try {
            const admin = await AuthAdmin();

            dispatch(set_Authenticate({
                first_name: admin.first_name || '',
                user_cred: admin.user_cred || '',
                isAuth: admin.isAuthenticated,
                isAdmin: admin.isAdmin,
                is_staff: admin.is_staff,
            }));
        } catch (error) {
            console.error('Error during authentication check:', error);
        }
    }, [dispatch]);

    const getUser = useCallback(async () => {
        const accessToken = (localStorage.getItem('AccessToken'));
        if (!accessToken) {
            return;
        }
        try {
            const response = await axios.get('/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
            dispatch(get_UserDetails({
                first_name: response.data.first_name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                profile_pic: response.data.profile_pic || '',
            }));
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            getUser();
        }
    }, [isAuthenticated, getUser]);

    useEffect(() => {
        if (!first_name) {
            authCheck();
        }
    }, [first_name, authCheck]);

    return (
        <div>
            <Routes>
                
                {/* <Route path='/DashBoard/*' element={<AdminPrivateRouter><AdminDashboard /></AdminPrivateRouter>} /> */}
                <Route path='/movieManagement/*' element={<AdminPrivateRouter><MoviePage /></AdminPrivateRouter>} />
                <Route path='/admintheaterManagement/' element={<AdminPrivateRouter><AdminTheaterPage /></AdminPrivateRouter>} />
                <Route path='/movieManagement/genre/' element={<AdminPrivateRouter><Genres /></AdminPrivateRouter>} />
                <Route path='/movieManagement/language/' element={<AdminPrivateRouter><Language /></AdminPrivateRouter>} />
                <Route path='/StaffManagement/' element={<AdminPrivateRouter><StaffManagement /></AdminPrivateRouter>} />



                <Route path='/screenTypeManagement/' element={<StaffPrivateRouter><ScreenType /></StaffPrivateRouter>} />
                <Route path='/screenManagement/' element={<StaffPrivateRouter><ScreenPage /></StaffPrivateRouter>} />
                <Route path='/theaterManagement/' element={<StaffPrivateRouter><TheaterPage /></StaffPrivateRouter>} />
                {/* <Route path='/staffDashboard/' element={<StaffPrivateRouter><StaffDashboard /></StaffPrivateRouter>} /> */}
                <Route path='/showManagement/' element={<StaffPrivateRouter><ShowPage /></StaffPrivateRouter>} />
                <Route path='/seatTypeManagement/' element={<StaffPrivateRouter><SeatTypePage /></StaffPrivateRouter>} />
                <Route path="/SelectSeating/:screenId" element={<StaffPrivateRouter><SeatingPage/></StaffPrivateRouter>} />

            </Routes>
        </div>
    );
}

export default AdminWrapper;
