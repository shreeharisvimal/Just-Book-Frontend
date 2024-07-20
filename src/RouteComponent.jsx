import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import StaffPrivateRouter from './Wrappers/StaffPrivateRouter';
import './Wrappers/Loader.scss'
import 'react-toastify/dist/ReactToastify.css';



const LandingPage = lazy(() => import('./Pages/User/LandingPage/LandingPage'));
const Profile = lazy(() => import('./Pages/User/Profile/Profile'));
const PrivateRouter = lazy(() => import('./Wrappers/PrivateRouter'));
const AdminWrapper = lazy(() => import('./Wrappers/AdminWrapper'));
const MovieDetails = lazy(()=> import('./Pages/User/MovieDetails/MovieDetails'))
const ShowPage = lazy(()=> import('./Pages/User/ShowListing/Show'))
const SeatingPage = lazy(()=> import('./Pages/User/SeatingPage/Seating'))
const BookingPage = lazy(()=> import('./Pages/User/BookingPage/BookingPage'))
const VerifyTicket = lazy(()=> import('./Pages/Staff/Verify/VerifyPage'))
const AdminLogin = lazy(() => import('./Components/AdminSide/Login/Login'));
const SuccessPage = lazy(()=> import('./Components/UserSide/sucesspage/Sucess'))


function RouteComponent() {

  return (
    
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="loader"></div>
    </div> }>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="admin/*" element={<AdminWrapper />} />
          <Route path='admin/' element={<AdminLogin />} />
          <Route path="profile" element={<PrivateRouter><Profile /></PrivateRouter>} />
          <Route path="otpVarify/" element={<LandingPage />} />
          <Route path="MovieDetails/" element={<MovieDetails/>} />
          <Route path="ShowsListing/:movieId/" element={<ShowPage/>} />
          <Route path="ShowsListing/:movieId/SeatingPage/:screenId/:showId/" element={<SeatingPage/>} />
          <Route path="BookTicket/" element={<PrivateRouter><BookingPage/></PrivateRouter>} />
          <Route path="/verify/:qr_code_id" element={<StaffPrivateRouter><VerifyTicket/></StaffPrivateRouter>} />
          <Route path='SuccessPage/:id/' element={<PrivateRouter><SuccessPage/></PrivateRouter>}/>
        </Routes>
      </Suspense>
  );
}

export default RouteComponent;
