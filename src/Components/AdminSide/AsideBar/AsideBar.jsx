import React from 'react';
import styles from './AsideBar.module.scss'; // Import the CSS module
import Image from '../../../logo192.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function AsideBar() {
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(`/admin/${path}`);
  };

  return (
    <aside className={styles.asideBar__navbarAside} id="offcanvas_aside">
      <div className={styles.asideBar__asideTop}>
        {/* Logo and Minimize Button */}
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
        {/* Main Menu Section */}
        <ul className={styles.asideBar__menuAside}>
          {/* Active Menu Item */}
          <li className={`${styles.menuItem} ${styles.active}`}>
            <a className={styles.menuLink} onClick={() => handleClick('DashBoard/')}>
              <i className="icon material-icons md-home"></i>
              <span className={styles.text}>Dashboard</span>
            </a>
          </li>

          {/* Movie Management with Dropdown */}
          <li className={styles.menuItem}>
            <a className={styles.menuLink} onClick={() => handleClick('movieManagement/')}>
              <i className="icon material-icons md-shopping_bag"></i>
              <span className={styles.text}>Movie Management</span>
              <i className={`material-icons ${styles.dropdownIcon} md-expand_less`}></i>
            </a>
          </li>
          {/* Other Menu Items */}
          <li className={styles.menuItem}>
            <a className={styles.menuLink} onClick={() => handleClick('admintheaterManagement/')}>
              <i className="icon material-icons md-comment"></i>
              <span className={styles.text}>Theater Management</span>
            </a>
          </li>
          
          <li className={styles.menuItem}>
            <a className={styles.menuLink} onClick={() => handleClick('StaffManagement/')}>
              <i className="icon material-icons md-stars"></i>
              <span className={styles.text}>Staff Management</span>
            </a>
          </li>
          
          {/* Regular Menu Items (optional for consistency) */}
          <li className={`${styles.menuItem} ${styles.disabled}`}>
            <a className={styles.menuLink} disabled href="#">
              <i className="icon material-icons md-pie_chart"></i>
              <span className={styles.text}>Statistics</span>
            </a>
          </li>
        </ul>

        {/* Separator */}
        <hr className={styles.asideBar__hr} />

        {/* Second Menu Section */}
        <ul className={styles.asideBar__menuAside}>
          {/* Menu Item with Submenu */}
          <li className={`${styles.menuItem} ${styles.hasSubmenu}`}>
            <a className={styles.menuLink} href="#">
              <i className="icon material-icons md-settings"></i>
              <span className={styles.text}>Settings</span>
            </a>
            <div className={`${styles.submenu}`}>
              <a href="page-settings-1.html">Setting sample 1</a>
              <a href="page-settings-2.html">Setting sample 2</a>
            </div>
          </li>

          {/* Regular Menu Item */}
          <li className={styles.menuItem}>
            <a className={styles.menuLink} href="page-blank.html">
              <i className="icon material-icons md-local_offer"></i>
              <span className={styles.text}>Starter page</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default AsideBar;
