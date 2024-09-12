import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MainHeader from './components/MainHeader';
import UploadSection from './components/UploadSection';
import './assets/styles/global.css';

const App = () => {
    return (
        <div className="d-flex flex-column">
            <div className="min-vh-100">
                <Navbar sticky="top" />
                <div className="flex-grow-1 mt-5">
                    <MainHeader />
                    <UploadSection />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default App;
