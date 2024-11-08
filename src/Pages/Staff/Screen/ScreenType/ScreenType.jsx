import React, { lazy, Suspense, useEffect, useState } from 'react';
import './ScreenType.scss';
import axios from '../../../../Admin_axios';
import { toast } from 'react-toastify';

const NavBar = lazy(() => import('../../../../Components/StaffSide/Navbar/AdminNavBar'));
const AsideBar = lazy(() => import('../../../../Components/StaffSide/AsideBar/AsideBar'));
const ScreenTypeComp = lazy(() => import('../../../../Components/StaffSide/Screen/Type/ScreenType'));

function ScreenType() {
  const [showCreate, setShowCreate] = useState(false);
  const [screenTypes, setScreenTypes] = useState([]);

  const fetchScreenType = async () => {
    try {
      const resp = await axios.get('theater/ScreenTypeApiCreate/');
      if (resp.status === 200) {
        setScreenTypes(resp.data);
      }
    } catch (error) {
      toast.error('Failed to fetch screen types. Please try again later.');
    }
  };

  useEffect(() => {
    fetchScreenType();
  }, [showCreate]);

  const handleDelete = async (id) => {
    try {
      const resp = await axios.delete(`theater/ScreenTypeApiDelete/${id}/`);
      if (resp.status === 204) {
        fetchScreenType();
        toast.warning('The screen type was deleted successfully.');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete the screen type. Please try again.');
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AsideBar />
        <NavBar />
      <div className="container">
        <div className="container__box">
          <button 
            className="container__button" 
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? 'CLOSE' : 'CREATE SCREEN TYPE'}
          </button>
          {showCreate ? (
            <ScreenTypeComp onCreate={() => setShowCreate(false)} />
          ) : (
            <div>
              <h2 className="container__title">Existing Screen Types</h2>
              {screenTypes.length > 0 ? (
                <ul className="container__list">
                  {screenTypes.map((screenType) => (
                    <li key={screenType.id} className="container__list-item">
                      <span>
                        <strong>SCREEN TYPE NAME:</strong> {screenType.name} <br />
                        <strong>EXTRA COST:</strong> {screenType.price_multi} %
                      </span>
                      <button 
                        className="container__list-item__delete-button" 
                        onClick={() => handleDelete(screenType.id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No screen types available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}

export default ScreenType;
