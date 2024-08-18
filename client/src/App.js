import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UploadSection from './components/UploadSection';
import './assets/styles/global.css';

const App = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1 mt-3" style={{ marginTop: '20px' }}>
                <UploadSection />
            </div>
            <Footer />
        </div>
    );
};

export default App;
