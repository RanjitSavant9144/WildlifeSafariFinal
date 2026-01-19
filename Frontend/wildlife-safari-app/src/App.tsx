import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SafariSlots from './pages/SafariSlots';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import TestConnection from './pages/TestConnection';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/slots" element={<SafariSlots />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/test-connection" element={<TestConnection />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
