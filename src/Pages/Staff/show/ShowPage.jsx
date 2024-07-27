import React, { useState, useEffect } from 'react';
import './ShowPage.scss';
import axios from '../../../axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AsideBar = React.lazy(() => import('../../../Components/StaffSide/AsideBar/AsideBar'));
const NavBar = React.lazy(() => import('../../../Components/StaffSide/Navbar/AdminNavBar'));
const ShowComp = React.lazy(() => import('../../../Components/StaffSide/Show/Show'));

function ShowPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [shows, setShows] = useState([]);
  const user = useSelector((state) => state.auth_user);

  const FetchShows = async () => {
    toast.loading("Fetching shows...");
    try {
      const resp = await axios.get(`/show/showCreateApi/email/${user.user_cred}/`);
      if (resp.status === 200) {

        setShows(resp.data);
        toast.dismiss();
      }
      else{
        toast.dismiss();
      }
    } catch (error) {
      console.log('An error has been found', error);
      toast.dismiss();
      toast.error('Error while fetching Shows');
    }
  };

  const HandleDelete = async(id)=>{
    toast.loading("Deleting show...");
    try{
      const resp = await axios.delete(`/show/showCreateApi/id/${id}/`)
      if (resp.status === 200){
        FetchShows();
      }
      toast.dismiss();
      toast.warning("Couldn't delete the show")
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    FetchShows();
  }, [showCreate]);

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className='show-page__container'>
        <AsideBar />
        <NavBar />
        <div className='show-page__content'>
          <button className='show-page__toggle-btn' onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? 'Close Creating' : 'Create Show'}
          </button>
          {showCreate ? (
            <ShowComp setShowCreate={setShowCreate}/>
          ) : (
            <div className='show-page__table-container'>
              <h2>Show List</h2>
              <table className='show-page__table'>
                <thead>
                  <tr>
                    <th>Movie</th>
                    <th>Theater</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Screen</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shows && shows.map((show) => (
                    <tr key={show.id}>
                      <td>{show.movie.title}</td>
                      <td>{show.theater.theater_name}</td>
                      <td>{show.show_date}</td>
                      <td>{show.show_time}</td>
                      <td>{show.price}</td>
                      <td>{show.screen.name}</td>
                      <td><button onClick={()=>HandleDelete(show.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </React.Suspense>
  );
}

export default ShowPage;
