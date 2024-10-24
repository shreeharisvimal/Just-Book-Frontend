import React, { lazy, Suspense, useEffect, useState } from 'react';
import './ScreenType.scss';
import axios from '../../../../Admin_axios';
import { toast } from 'react-toastify';

const NavBar = lazy(() => import('../../../../Components/StaffSide/Navbar/AdminNavBar'));
const AsideBar = lazy(() => import('../../../../Components/StaffSide/AsideBar/AsideBar'));
const ScreenTypeComp = lazy(() => import('../../../../Components/StaffSide/Screen/Type/ScreenType'));

function ScreenType() {
  const [showCreate, setshowCreate] = useState(false);
  const [screenTypes, setscreenType] = useState([]);

  const fetchScreenType = async () => {
    try {
      const resp = await axios.get('theater/ScreenTypeApiCreate/');
      if (resp.status === 200) {
        setscreenType(resp.data);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchScreenType();
  }, [showCreate]);

  const handleDelete = async (id) => {
    try {
      const resp = await axios.delete(`theater/ScreenTypeApiDelete/${id}/`);
      fetchScreenType();
      toast.warning('The Screen type deleted');
    } catch (error) {
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
        <AsideBar />
      <div className="container">
        <NavBar />
        <div className="container__box">
          <button 
            className="container__button" 
            onClick={() => setshowCreate(!showCreate)}>
              CREATE SCREEN TYPE
          </button>
          {showCreate ? (
            <ScreenTypeComp />
          ) : (
            <div>
              <h2 className="container__title">Existing Screen Types</h2>
              <ul className="container__list">
                {screenTypes.map(screenType => (
                  <li key={screenType.id} className="container__list-item">
                    <span>
                      <strong>SCREEN TYPE NAME:</strong> {screenType.name} <br />
                      <strong>EXTRA COST:</strong> {screenType.price_multi} %
                    </span>
                    <button 
                      className="container__list-item__delete-button" 
                      onClick={() => handleDelete(screenType.id)}>
                        Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}

export default ScreenType;
