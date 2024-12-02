import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Main from './pages/Main';
import AddContact from './pages/AddContact';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Account from './pages/Account';
import About from './components/About';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Home" element={<Main />} />
        <Route path="/Add-Contact" element={<AddContact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/account" element={<Account />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </Router>
  );
};

export default App;
