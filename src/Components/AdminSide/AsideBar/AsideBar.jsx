import React from 'react';
import Image from '../../../logo192.png';
import styles from './AsideBar.module.scss'; 
import { useLocation, useNavigate } from 'react-router-dom'; 

function AsideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  function getLastSegment() {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments.pop();
  }

  const handleClick = (path) => {
    navigate(`/admin/${path}`);
  };

  return (
    <aside className={styles.asideBar__navbarAside} id="offcanvas_aside">
      <div className={styles.asideBar__asideTop}>
        <a href="index.html" className={styles.asideBar__brandWrap}>
          <img src={Image} className={styles.logo} alt="JustBook Dashboard" />
          <strong className={styles.Justbook}>JUSTBOOK</strong>
        </a>
        <div>
          <button className={styles.asideBar__btnAsideMinimize}>
            <i className="text-muted material-icons md-menu_open"></i>
          </button>
        </div>
      </div>

      <nav className={styles.asideBar__nav}>
        <ul className={styles.asideBar__menuAside}>
          <li className={`${styles.menuItem} ${ getLastSegment() === 'movieManagement' ? styles.active : ''}`}>
            <a className={styles.menuLink} onClick={() => handleClick('movieManagement/')}>
              <i className="icon material-icons md-shopping_bag"></i>
              <span className={styles.text}>Movie Management</span>
              <i className={`material-icons ${styles.dropdownIcon} md-expand_less`}></i>
            </a>
          </li>
          <li className={`${styles.menuItem} ${ getLastSegment() === 'admintheaterManagement' ? styles.active : ''}`}>
            <a className={styles.menuLink} onClick={() => handleClick('admintheaterManagement/')}>
              <i className="icon material-icons md-comment"></i>
              <span className={styles.text}>Theater's Management</span>
            </a>
          </li>
          
          <li className={`${styles.menuItem} ${ getLastSegment() === 'StaffManagement' ? styles.active : ''}`}>
            <a className={styles.menuLink} onClick={() => handleClick('StaffManagement/')}>
              <i className="icon material-icons md-stars"></i>
              <span className={styles.text}>Staff Management</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default AsideBar;
