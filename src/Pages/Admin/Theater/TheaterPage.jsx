import React, { useEffect, useState } from 'react';
import './TheaterPage.scss';
import axios from '../../../Admin_axios';
import { toast } from 'react-toastify';
import HandlePageReload from '../../../Utils/PageReloadComponent'


const WarningBox = React.lazy(() => import('../../../Utils/WarningBox'));
const NavBar = React.lazy(() => import('../../../Components/AdminSide/Navbar/AdminNavBar'));
const AsideBar = React.lazy(() => import('../../../Components/AdminSide/AsideBar/AsideBar'));
const TheaterComp = React.lazy(() => import('../../../Components/StaffSide/Theater/Theater'));
const FilterComponent = React.lazy(() => import('./TheaterFilter'));
const Pagination = React.lazy(() => import('../../../Utils/PaginationComponent'));


function TheaterPage() {
  const [apiLink, setApiLink] = useState('');
  const [onOpen, setOnOpen] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);
  const [theater, setTheater] = useState([]);
  const [showTheater, setShowTheater] = useState(false);
  const [fixedlen, setFixedlen] = useState(0); 
  const [paginationLink, setPaginationLink] = useState('');
  const [resetKey, setResetKey] = useState(0);


  const fetchTheaters = async () => {
    try {

      setPaginationLink('/theater/TheaterApiListCreateAPIView/');

    } catch (error) {
      toast.error('Failed to fetch theaters.');
    }
  };

  useEffect(() => {
    if (onSuccess) {
      toast.dismiss();
      toast.success('Theater deleted successfully');
      setOnSuccess(false);
    }
    fetchTheaters();
  }, [onSuccess, showTheater]);

  const deleteTheater = async (id) => {
    toast.loading('Deleting theater...');
    try {
      setApiLink(`/theater/TheaterApiRetrieveUpdateDestroyAPIView/${id}/`);
      setOnOpen(true);
    } catch (error) {
      toast.error('Failed to delete theater');
    }
  };

  const approveStatus = async (id) => {
    try {
      const resp = await axios.put(`/theater/TheaterPutClassApi/${id}/`, {'status' : 'APPROVED'});
      if (resp.status === 200) {
        toast.success('Theater is approved');
        HandlePageReload();
      }
    } catch (error) {
      toast.error('Failed to approve theater');
      console.error(error);
    }
  };

  const rejectStatus = async (id) => {
    try {
      const resp = await axios.put(`/theater/TheaterPutClassApi/${id}/`, {'status' : 'REJECTED'});
      if (resp.status === 200) {
        toast.success('Theater is rejected');
        HandlePageReload();
      }
    } catch (error) {
      toast.error('Failed to reject theater');
      console.error(error);
    }
  };

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {onOpen && <WarningBox apiLink={apiLink} setOnOpen={setOnOpen} setOnSuccess={setOnSuccess} />}
      <div className="theater-page__container">
        <AsideBar />
        <NavBar />
        {!showTheater && <FilterComponent handleFilterReset={resetKey} fixedlen={fixedlen} theater={theater} setTheater={setTheater} />}
        {showTheater ? (
          <TheaterComp />
        ) : (
          <div className="theater-page__content">
            <div className="theater-page__theater-list">
              {theater.map((theater) => (
                <div className="theater-page__theater-card" key={theater.id}>
                  <div className={`theater-page__theater-header ${theater.theater_status}`}>
                    <h3>{theater.theater_name}</h3>
                  </div>
                  <div className="theater-page__details">
                    <p><strong>Email:</strong> {theater.email}</p>
                    <p><strong>Phone:</strong> {theater.phone}</p>
                    <p><strong>Address:</strong> {theater.address}</p>
                    <p><strong>City:</strong> {theater.city}</p>
                    <p><strong>State:</strong> {theater.state}</p>
                    <p><strong>Theater Status:</strong> {theater.theater_status}</p>
                  </div>
                  <div className="theater-page__actions">
                    <button className="theater-page__delete-btn" onClick={() => deleteTheater(theater.id)}>
                      Delete
                    </button>
                    {theater.theater_status === 'PENDING' && (
                      <div>
                        <button
                          className="theater-page__approve-btn"
                          onClick={() => approveStatus(theater.id)}
                        >
                          APPROVE
                        </button>

                        <button
                          className="theater-page__reject-btn"
                          onClick={() => rejectStatus(theater.id)}
                        >
                          REJECT
                        </button>
                  </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      { paginationLink && !showTheater &&
        <Pagination setHandleFilterReset={() => setResetKey(prev => prev + 1)} apiLink={paginationLink} setApiLink={setPaginationLink} stateUpdateFunction={setTheater} setFixedlen={setFixedlen}/>
      }
      </div>
    </React.Suspense>
  );
}

export default TheaterPage;
