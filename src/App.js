
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from './components/MainLayout';
import CheckoutLayout from './components/CheckoutLayout';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // Function to update user state from localStorage
  const updateUserFromStorage = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // console.log('User loaded from storage:', parsedUser);
      setUser(parsedUser);
      return parsedUser;
    } else {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    // Initial load
    updateUserFromStorage();
  }, []);

  // console.log('Current user in App:', user);
  // console.log('App rendering, current route:', window.location.pathname, 'user:', user);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={<LoginPage updateUser={updateUserFromStorage} />} 
        />
        <Route 
          path="/signup" 
          element={<LoginPage updateUser={updateUserFromStorage} />} 
        />
        <Route 
          path="/" 
          element={<LandingPage cartItems={cartItems} setCartItems={setCartItems} user={user} setUser={setUser} />} 
        />
        <Route 
          path="/menu" 
          element={<MainLayout cartItems={cartItems} setCartItems={setCartItems} user={user} />} 
        />
        <Route 
          path="/checkout" 
          element={<CheckoutLayout cartItems={cartItems} setCartItems={setCartItems} user={user} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;