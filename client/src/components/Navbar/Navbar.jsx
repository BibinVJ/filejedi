import React from 'react';
import styles from './Navbar.module.css';
import logo from '../../assets/images/logo-black.png';

const Navbar = () => {
  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Logo" className={styles.logo} />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className={`nav-link ${styles.navLink}`} href="#">SITE-NAME</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${styles.navLink}`} href="#">TOOLS</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
