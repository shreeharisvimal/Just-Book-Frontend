import React, { useState, useEffect } from 'react';
import './ShowPage.scss';
import axios from '../../../axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const WarningBox = React.lazy(()=> import('../../../Utils/WarningBox'));
const AsideBar = React.lazy(() => import('../../../Components/StaffSide/AsideBar/AsideBar'));
const NavBar = React.lazy(() => import('../../../Components/StaffSide/Navbar/AdminNavBar'));
const ShowComp = React.lazy(() => import('../../../Components/StaffSide/Show/Show'));
const FilterComponent = React.lazy(() => import('./ShowFilter'));
const Pagination = React.lazy(() => import('../../../Utils/PaginationComponent'));



function ShowPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [shows, setShows] = useState([]);
  const [apiLink, setApiLink] = useState('');
  const [onOpen, setOnOpen] = useState('');
  const [onSuccess, setOnSuccess] = useState(false)
  const user = useSelector((state) => state.auth_user);
  const [fixedlen, setFixedlen] = useState(0);
  const [paginationLink, setPaginationLink] = useState('');
  const [resetKey, setResetKey] = useState(0)



  const FetchShows = async () => {
    toast.loading("Fetching shows...");
    try {
      setPaginationLink(`/show/showCreateApi/email/${user.user_cred}/`);
      toast.dismiss()
    } catch (error) {
      console.log('An error has been found', error);
      toast.dismiss();
      toast.error('Error while fetching Shows');
    }
  };

  const HandleDelete = async(id)=>{
    toast.loading("Deleting show...");
    try{
      setApiLink(`/show/showCreateApi/id/${id}/`)
      setOnOpen(true)
    }catch(error){
      console.log(error)
    }
  }

    

  useEffect(() => {
    FetchShows();
  }, [showCreate]);


  useEffect(() => {
    if (onSuccess) {
      FetchShows();
      toast.dismiss();
      toast.success("Show deleted successfully");
      setOnSuccess(false);
    }
  }, [onSuccess]);

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
        <AsideBar />
        <NavBar />
      <div className='show-page__container'>
      {!showCreate && <FilterComponent handleFilterReset={resetKey} fixedlen={fixedlen} obj={shows} updateFunc={setShows} />}
       {onOpen && <WarningBox apiLink={apiLink} setOnOpen={setOnOpen} setOnSuccess={setOnSuccess}/> }
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
                      <td><button className="show-page__delete-button" onClick={()=>HandleDelete(show.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        { paginationLink && !showCreate &&
            <Pagination setHandleFilterReset={() => setResetKey(prev => prev + 1)}  apiLink={paginationLink} setApiLink={setPaginationLink} stateUpdateFunction={setShows} setFixedlen={setFixedlen}/>
          
          }
      </div>
    </React.Suspense>
  );
}

export default ShowPage;
