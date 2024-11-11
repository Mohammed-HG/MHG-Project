import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import Login from './components/Login';
import Main from './components/Main';

function App() {
  return (
    <Router> 
      <div className="App">
      <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />

        </Routes>
      </div>
    </Router>
    
  );
}

export default App;