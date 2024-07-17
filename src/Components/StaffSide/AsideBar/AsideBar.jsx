import React from 'react';
import './AsideBar.scss';
import Image from '../../../logo192.png';
import { useNavigate } from 'react-router-dom'; 

function AsideBar() {
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(`/admin/${path}`);
  };

  return (
    <aside className="aside-bar__navbar-aside" id="offcanvas_aside">
      <div className="aside-bar__aside-top">
        {/* Logo and Minimize Button */}
        <a href="index.html" className="aside-bar__brand-wrap">
          <img src={Image} className="logo" alt="JustBook Dashboard" />
          <strong className="Justbook">JUSTBOOK</strong>
        </a>
        <div>
          <button className="aside-bar__btn-aside-minimize">
            <i className="text-muted material-icons md-menu_open"></i>
          </button>
        </div>
      </div>

      <nav className="aside-bar__nav">
        {/* Main Menu Section */}
        <ul className="aside-bar__menu-aside">
          {/* Active Menu Item */}
          <li className="menu-item active">
            <a className="menu-link" onClick={() => handleClick('staffDashboard/')}>
              <i className="icon material-icons md-home"></i>
              <span className="text">Dashboard</span>
            </a>
          </li>
          {/* Other Menu Items */}
          <li className="menu-item">
            <a className="menu-link" onClick={() => handleClick('theaterManagement/')}>
              <i className="icon material-icons md-comment"></i>
              <span className="text">Theater Management</span>
            </a>
          </li>
          <li className="menu-item">
            <a className="menu-link" onClick={() => handleClick('screenManagement/')}>
              <i className="icon material-icons md-stars"></i>
              <span className="text">Screen Management</span>
            </a>
          </li>
          <li className="menu-item">
            <a className="menu-link" onClick={() => handleClick('screenTypeManagement/')}>
              <i className="icon material-icons md-stars"></i>
              <span className="text">Screen Type Management</span>
            </a>
          </li>
          <li className="menu-item">
            <a className="menu-link" onClick={() => handleClick('showManagement/')}>
              <i className="icon material-icons md-stars"></i>
              <span className="text">Show Management</span>
            </a>
          </li>
          <li className="menu-item">
            <a className="menu-link" onClick={() => handleClick('seatTypeManagement/')}>
              <i className="icon material-icons md-stars"></i>
              <span className="text">Seat Type Management</span>
            </a>
          </li> 
        </ul>

        {/* Separator */}
        <hr className="aside-bar__hr" />

        {/* Second Menu Section */}
        <ul className="aside-bar__menu-aside">
          {/* Menu Item with Submenu */}
          <li className="menu-item has-submenu">
            <a className="menu-link" href="#">
              <i className="icon material-icons md-settings"></i>
              <span className="text">Settings</span>
            </a>
            <div className="submenu">
              <a href="page-settings-1.html">Setting sample 1</a>
              <a href="page-settings-2.html">Setting sample 2</a>
            </div>
          </li>

          {/* Regular Menu Item */}
          <li className="menu-item">
            <a className="menu-link" href="page-blank.html">
              <i className="icon material-icons md-local_offer"></i>
              <span className="text">Starter page</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default AsideBar;
