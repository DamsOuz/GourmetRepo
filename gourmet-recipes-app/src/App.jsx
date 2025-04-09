import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import './App.css';


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
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

// // App.jsx
// import React from 'react';
// import TestAPIs from './components/TestAPI';

// function App() {
//   return (
//     <div>
//       <h1>Application de Test des API</h1>
//       <TestAPIs />
//     </div>
//   );
// }

// export default App;
