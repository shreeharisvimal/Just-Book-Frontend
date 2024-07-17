import React, { useState } from 'react';
import './AsideBar.scss';

const AsideBar = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isOtherOpen, setIsOtherOpen] = useState(false);

  const toggleDropdown = (setter) => {
    setter(prevState => !prevState);
  };

  return (
    <div className="aside-bar">
      <h2 className="aside-bar__title">Filters</h2>
      <div className="aside-bar__dropdown">
        <button onClick={() => toggleDropdown(setIsLanguageOpen)} className="aside-bar__dropdown-btn">
          Language {isLanguageOpen ? '▲' : '▼'}
        </button>
        {isLanguageOpen && (
          <div className="aside-bar__dropdown-content">
            <label className="aside-bar__dropdown-item">
              <input className='aside-bar__checkbox' type="checkbox" /> English
            </label>
            <label className="aside-bar__dropdown-item">
              <input className='aside-bar__checkbox' type="checkbox" /> Spanish
            </label>
            <label className="aside-bar__dropdown-item">
              <input className='aside-bar__checkbox' type="checkbox" /> French
            </label>
          </div>
        )}
      </div>
      
      <div className="aside-bar__dropdown">
        <button onClick={() => toggleDropdown(setIsGenreOpen)} className="aside-bar__dropdown-btn">
          Genre {isGenreOpen ? '▲' : '▼'}
        </button>
        {isGenreOpen && (
          <div className="aside-bar__dropdown-content">
            <label className="aside-bar__dropdown-item">
              <input className='aside-bar__checkbox' type="checkbox" /> Action
            </label>
            <label className="aside-bar__dropdown-item">
              <input className='aside-bar__checkbox' type="checkbox" /> Adventure
            </label>
            <label className="aside-bar__dropdown-item">
              <input className='aside-bar__checkbox' type="checkbox" /> Comedy
            </label>
          </div>
        )}
      </div>
      
      <div className="aside-bar__dropdown">
        <button onClick={() => toggleDropdown(setIsOtherOpen)} className="aside-bar__dropdown-btn">
          Other {isOtherOpen ? '▲' : '▼'}
        </button>
        {isOtherOpen && (
          <div className="aside-bar__dropdown-content">
            <label className="aside-bar__dropdown-item">
              <input className='aside-bar__checkbox' type="checkbox" /> Upcoming
            </label>
            <label className="aside-bar__dropdown-item">
              <input className='aside-bar__checkbox' type="checkbox" /> Popular
            </label>
            <label className="aside-bar__dropdown-item">
              <input className='aside-bar__checkbox' type="checkbox" /> Top Rated
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsideBar;
