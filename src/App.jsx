import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import TouristPage from './pages/TouristPage';
import PackageList from './pages/PackageList';
import PackageDetails from './components/PackageDetails';
import ReservationForm from './components/ReservationForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/tourist" element={<TouristPage />} />
        <Route path="/package" element={<PackageList />} />
        <Route path="/deets" element={<PackageDetails />} />
        <Route path="/reserve" element={<ReservationForm />} />
      </Routes>
    </Router>
  );
};

export default App;
