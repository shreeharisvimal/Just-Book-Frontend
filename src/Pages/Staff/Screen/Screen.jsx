import React, { useEffect, useState } from 'react';
import axios from '../../../Admin_axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Screen.module.scss';

const WarningBox = React.lazy(()=> import('../../../Utils/WarningBox'));
const AsideBar = React.lazy(() => import('../../../Components/StaffSide/AsideBar/AsideBar'));
const NavBar = React.lazy(() => import('../../../Components/StaffSide/Navbar/AdminNavBar'));
const ScreenComp = React.lazy(() => import('../../../Components/StaffSide/Screen/Screen'));

function Screen() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [myScreens, setmyScreens] = useState([]);
  const [apiLink, setApiLink] = useState('');
  const [onOpen, setOnOpen] = useState('');
  const [onSuccess, setOnSuccess] = useState(false)

  const user = useSelector((state) => state.auth_user);

  const AccessToken = localStorage.getItem('AccessToken');

  const FetchScreens = async () => {
    try {
      const resp = await axios.get(`theater/ScreenApiGet/${user.user_cred}/`, {
        headers: {
          'Authorization': `Bearer ${AccessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      setmyScreens(resp.data);
    } catch (error) {
      console.log('An error has occurred');
    }
  };

  useEffect(() => {
    if (onSuccess) {
      toast.dismiss();
      toast.success("Show deleted successfully");
      setOnSuccess(false);
    }
    FetchScreens();
  }, [showCreate, onSuccess]);

  const handleDelete = async (id) => {
    toast.loading("Deleting Screen...");
    try {
      setApiLink(`theater/ScreenApiDelete/${id}/`)
      setOnOpen(true)
    } catch (error) {
      console.log('An error has occurred', error);
    }
  };

  const HandleSeatAllocationDelete = async (id) => {
    toast.loading("Deleting Screen seat Allocation...");
    try {
      setApiLink(`theater/SeatAllocationApiDelete/${id}/`)
      setOnOpen(true)
    } catch (error) {
      console.log('An error has occurred', error);
    }
  };

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <AsideBar />
      <div className={styles.screen__container}>
       {onOpen && <WarningBox apiLink={apiLink} setOnOpen={setOnOpen} setOnSuccess={setOnSuccess}/> }
        <button onClick={() => setShowCreate(!showCreate)} className={styles.screen__button}>
          CREATE SCREEN
        </button>
        {showCreate ? (
          <ScreenComp setShowCreate={setShowCreate}/>
        ) : (
          <div>
            <h2 className={styles.screen__title}>Existing Screen Types</h2>
            <ul className={styles.screen__list}>
              {myScreens.map((screen) => (
                <li key={screen.id} className={styles.screen__listItem}>
                  <span>
                    <strong>SCREEN NAME OR NUMBER:</strong> {screen.name.toUpperCase()} <br />
                    <strong>THEATER NAME:</strong> {screen.theater.theater_name.toUpperCase()} <br />
                    <strong>THEATER SCREENS COUNT:</strong> {screen.theater.no_of_screens} <br />
                    <strong>SCREEN TYPE:</strong> {screen.screen_type.name} <br />
                    <strong>EXTRA COST:</strong> {screen.screen_type.price_multi} %<br />
                    <div>
                    {screen.seats[0] ? (
                      <button 
                        onClick={() => HandleSeatAllocationDelete(screen.seats[0].id)} 
                        className={styles.screen__seatButtonDelete}
                      >
                        Delete Seat Allocation
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate(`/admin/SelectSeating/${screen.id}`)} 
                        className={styles.screen__seatButtonAdd}
                      >
                        Add Seat Allocation
                      </button>
                    )}
                  </div>
                  </span>
                  <button
                    className={styles.screen__listItem__deleteButton}
                    onClick={() => handleDelete(screen.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </React.Suspense>
  );
}

export default Screen;
