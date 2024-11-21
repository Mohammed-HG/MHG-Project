import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './components/Index';
import Register from './components/Register';
import Login from './components/Login';
import Main from './components/Main';
import AddContact from './components/AddContact';
import NavBar from './adds/NavBar';
import MessageModal from './components/MessageModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@react-login-page/page5';

function App() {
  return (
    <Router> 
      <div className="App">
      <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Home" element={<Main />} />
          <Route path="/Add-Contact" element={<AddContact />} />
          <Route path="/NavBar" element={<NavBar />} />
          <Route path="/MessageModal" element={<MessageModal />} />

        </Routes>
      </div>
    </Router>
    
  );
}

export default App;