import React from 'react';
import styles from './MainHeader.module.css';


const MainHeader = () => {
    return (
        <div className={styles.header_section}>
            <p className={styles.main_header}>File Converter</p>
            <p className={styles.sub_header}>Convert your files from any format to any format.</p>
        </div>
    );
};

export default MainHeader;
