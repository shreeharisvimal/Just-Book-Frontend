import React from 'react';
import './AsideBar.scss';
import Image from '../../../logo192.png';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 

function AsideBar() {
  const location = useLocation();

  function getLastSegment() {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments.pop();
  }


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
          <li className={`menu-item ${getLastSegment() === 'theaterManagement' ? "active" : ''}`}>
            <a className="menu-link" onClick={() => handleClick('theaterManagement/')}>
              <i className="icon material-icons md-comment"></i>
              <span className="text">Theater Management</span>
            </a>
          </li>
          <li className={`menu-item ${getLastSegment() === 'screenManagement' ? "active" : ''}`}>
            <a className="menu-link" onClick={() => handleClick('screenManagement/')}>
              <i className="icon material-icons md-stars"></i>
              <span className="text">Screen Management</span>
            </a>
          </li>
          <li className={`menu-item ${getLastSegment() === 'screenTypeManagement' ? "active" : ''}`}>
            <a className="menu-link" onClick={() => handleClick('screenTypeManagement/')}>
              <i className="icon material-icons md-stars"></i>
              <span className="text">Screen Type Management</span>
            </a>
          </li>
          <li className={`menu-item ${getLastSegment() === 'showManagement' ? "active" : ''}`}>
            <a className="menu-link" onClick={() => handleClick('showManagement/')}>
              <i className="icon material-icons md-stars"></i>
              <span className="text">Show Management</span>
            </a>
          </li>
          <li className={`menu-item ${getLastSegment() === 'seatTypeManagement' ? "active" : ''}`}>
            <a className="menu-link" onClick={() => handleClick('seatTypeManagement/')}>
              <i className="icon material-icons md-stars"></i>
              <span className="text">Seat Type Management</span>
            </a>
          </li> 
        </ul>
      </nav>
    </aside>
  );
}

export default AsideBar;
