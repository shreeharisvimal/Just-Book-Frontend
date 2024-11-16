import React, { lazy, Suspense, useEffect, useState } from 'react';
import './ScreenType.scss';
import axios from '../../../../Admin_axios';
import { toast } from 'react-toastify';

const WarningBox = React.lazy(()=> import('../../../../Utils/WarningBox'));
const NavBar = lazy(() => import('../../../../Components/StaffSide/Navbar/AdminNavBar'));
const AsideBar = lazy(() => import('../../../../Components/StaffSide/AsideBar/AsideBar'));
const ScreenTypeComp = lazy(() => import('../../../../Components/StaffSide/Screen/Type/ScreenType'));
const FilterComponent = React.lazy(() => import('./ScreenTypeFilter'));

function ScreenType() {
  const [showCreate, setShowCreate] = useState(false);
  const [screenTypes, setScreenTypes] = useState([]);
  const [apiLink, setApiLink] = useState('');
  const [onOpen, setOnOpen] = useState('');
  const [fixedlen, setFixedlen] = useState(0);
  const [onSuccess, setOnSuccess] = useState(false)

  const fetchScreenType = async () => {
    try {
      const resp = await axios.get('theater/ScreenTypeApiCreate/');
      if (resp.status === 200) {
        setScreenTypes(resp.data);
        setFixedlen(resp.data.length)
      }
    } catch (error) {
      toast.error('Failed to fetch screen types. Please try again later.');
    }
  };

  useEffect(() => {
    if (onSuccess) {
      toast.dismiss();
      toast.success("Screen Type deleted successfully");
      setOnSuccess(false);
    }
    fetchScreenType();
  }, [showCreate, onSuccess]);

  const handleDelete = async (id) => {
    toast.loading("Deleting ScreenType...");
    try {
        setApiLink(`theater/ScreenTypeApiDelete/${id}/`)
        setOnOpen(true)
    } catch (error) {
      toast.error('Failed to delete the screen type. Please try again.');
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AsideBar />
        <NavBar />
       {onOpen && <WarningBox apiLink={apiLink} setOnOpen={setOnOpen} setOnSuccess={setOnSuccess}/> }

      <div className="container">
      <FilterComponent fixedlen={fixedlen} obj={screenTypes} updateFunc={setScreenTypes} />
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
