import React from 'react';
import styles from './Home.module.css';
import UploadSection from '../../components/UploadSection';

const Home = () => {
  return (
    <div className={styles.home}>
      <UploadSection />
    </div>
  );
};

export default Home;
