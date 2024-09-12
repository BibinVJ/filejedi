import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <span></span>
        <hr></hr>
        <span>&copy;2024 Filejedi</span>
      </div>
    </footer>
  );
};

export default Footer;
