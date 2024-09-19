// App.js
import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import HomePage from './components/HomePage';
import AccountPage from './components/AccountPage';
import AdminDashboard from './components/Admin'; 
import ProductManager from './components/product'; 
import OrderPage from './components/orderpage'; 
import RegistrationPage from './components/RegistrationPage';
import AdminLogin from './components/AdminLogin'; 
import AdminEdit from './components/AdminEdit'; 
import './App.css';

export const UserContext = createContext(null);

function App() {
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth(); // Initialize getAuth here

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]); // Ensure auth is included as a dependency

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/admin/login" />;
  };

  return (
    <UserContext.Provider value={{ user, auth }}>
      <Router>
        <div className='App-header'>
        <nav className="navbar navbar-expand-lg navbar-dark py-3 shadow-sm" style={{ backgroundColor: '#032d5d' }}>
            <div className="container">
              <Link className="navbar-brand d-flex align-items-center" to="/">
                <img src="https://3.bp.blogspot.com/-uKKV3BDM7SM/XJ_RwmRB6xI/AAAAAAAABXs/23P4ABAFEys6ut8a0EOicFTpHwbhJalTwCLcBGAs/s400/Culture%2BCollective%2BLogo.jpg" alt="Logo" height="40" />
                <span className="ml-2 font-weight-bold">Ethiopian Cultural Cloth</span>
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/#">Home</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <div className="dropdown" onMouseEnter={() => setExploreDropdownOpen(true)} onMouseLeave={() => setExploreDropdownOpen(false)}>
                      <button 
                        className="nav-link dropdown-toggle" 
                        id="navbarDropdownMenuLink" 
                        type="button"
                        aria-haspopup="true" 
                        aria-expanded={exploreDropdownOpen}
                      >
                        Explore Cultures
                      </button>
                      <ul className={`dropdown-menu ${exploreDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdownMenuLink">
                        <li><Link className="dropdown-item" to="/cultural/kids">For Kids</Link></li>
                        <li><Link className="dropdown-item" to="/cultural/oromo">Oromo</Link></li>
                        <li><Link className="dropdown-item" to="/cultural/amhara">Amhara</Link></li>
                        <li><Link className="dropdown-item" to="/cultural/tigre">Tigre</Link></li>
                        <li><Link className="dropdown-item" to="/cultural/debub">Debub</Link></li>
                        <li><Link className="dropdown-item" to="/cultural/other">Other Cultures</Link></li>
                      </ul>
                    </div>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/account">Account</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                  {user ? (
                    <li className="nav-item">
                      <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Login</Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/#" element={<HomePage />} />
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/adminedit" element={<ProtectedRoute><AdminEdit /></ProtectedRoute>} />
            <Route path="/product" element={<ProtectedRoute><ProductManager /></ProtectedRoute>} />
            <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
            <Route path="/register" element={<RegistrationPage />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
