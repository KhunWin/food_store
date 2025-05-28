// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ThemeProvider } from '@mui/material/styles';
// import theme from './theme';
// import Layout from './components/Layout';
// import AdminLogin from './components/AdminLogin';
// import Menu from './components/Menu';
// import LandingPage from './components/LandingPage';
// import FoodOrderingWebsite from './components/MainLayout';
// import CheckoutLayout from './components/CheckoutLayout';
// import MainLayout from './components/MainLayout';


// // function App() {
// //   return (
// //     <ThemeProvider theme={theme}>
// //       <Layout>
// //         {/* <AdminLogin /> */}
// //         {/* <Menu /> */}
// //         {/* <LandingPage /> */}
// //         {/* <FoodOrderingWebsite /> */}
// //         <LandingPage />
        

// //       </Layout>
// //     </ThemeProvider>
// //   );
// // }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<MainLayout />} />
//         <Route path="/checkout" element={<CheckoutLayout />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './components/MainLayout';
import CheckoutLayout from './components/CheckoutLayout';
import LandingPage from './components/LandingPage';


function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<LandingPage cartItems={cartItems} setCartItems={setCartItems} />} 
        />
        <Route 
          path="/checkout" 
          element={<CheckoutLayout cartItems={cartItems} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;