import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recettes/:id" element={<Recipe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/fav" element={<Favorites />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;