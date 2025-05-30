// import React from 'react';
// import MainLayout from './MainLayout';
// import Menu from './Menu';
// import { Link, useNavigate } from 'react-router-dom';

// export default function LandingPage({ cartItems, setCartItems, user, setUser }) {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     if (setUser) {
//       setUser(null);
//     }
//     // Instead of window.location.reload(), just navigate to home
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-green-50">
//       <header className="bg-green-700 text-white p-4 shadow-md">
//         <div className="container mx-auto flex items-center justify-between">
//           <div className="flex items-center">
//             <img src="/logo.svg" alt="Logo" className="h-12 mr-4" />
//             <h1 className="text-2xl font-bold">Delicious Food</h1>
//           </div>

//           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
//             {user ? (
//               <>
//                 <span>Welcome, {user.name}!</span>
//                 {user.status === 'admin' && (
//                   <span style={{
//                     padding: '0.25rem 0.5rem',
//                     backgroundColor: 'rgba(255,255,255,0.2)',
//                     borderRadius: '4px',
//                     fontSize: '0.8rem'
//                   }}>
//                     Admin
//                   </span>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   style={{
//                     padding: '0.5rem 1rem',
//                     backgroundColor: '#dc3545',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                     textDecoration: 'none'
//                   }}
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link 
//                   to="/login"
//                   style={{
//                     padding: '0.5rem 1rem',
//                     backgroundColor: '#007bff',
//                     color: 'white',
//                     borderRadius: '4px',
//                     textDecoration: 'none'
//                   }}
//                 >
//                   Sign In
//                 </Link>
//                 <Link 
//                   to="/signup"
//                   style={{
//                     padding: '0.5rem 1rem',
//                     backgroundColor: 'transparent',
//                     color: 'white',
//                     border: '1px solid white',
//                     borderRadius: '4px',
//                     textDecoration: 'none'
//                   }}
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Show Menu component only for admins */}
//       {user && user.status === 'admin' && (
//         <section className="bg-white shadow-md my-4">
//           <div className="container mx-auto">
//             <Menu />
//           </div>
//         </section>
//       )}

//       <main className="flex-grow container mx-auto p-4">
//         <MainLayout cartItems={cartItems} setCartItems={setCartItems} user={user} />
//       </main>

//       <footer className="bg-green-800 text-white p-4">
//         <div className="container mx-auto text-center">
//           <p>© 2025 Delicious Food. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }


import React from 'react';
import MainLayout from './MainLayout';
import Menu from './Menu';
import { Link, useNavigate } from 'react-router-dom';
import istockphoto from '../assets/images/istockphoto.jpg';

export default function LandingPage({ cartItems, setCartItems, user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (setUser) {
      setUser(null);
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F49F1C]">
      {/* Header/Navigation */}
      <header className="bg-white shadow-md relative z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-[#030E4F]">The Dorm Chef</div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#why-foodhut" className="text-gray-700 hover:text-[#F49F1C] transition-colors">Why the Dorm Chef</a>
              <a href="#menu" className="text-gray-700 hover:text-[#F49F1C] transition-colors">Our Menu</a>
              <a href="#popular-food" className="text-gray-700 hover:text-[#F49F1C] transition-colors">Our Popular food</a>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">Welcome, {user.name}!</span>
                  {user.status === 'admin' && (
                    <span className="px-2 py-1 bg-[#F49F1C] text-white rounded text-xs">
                      Admin
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-blue-500 text-red-300 rounded hover:bg-opacity-90 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="px-4 py-2 bg-[#030E4F] rounded hover:bg-opacity-90 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup"
                    className="px-4 py-2 border border-[#030E4F] text-[#030E4F] rounded hover:bg-[#030E4F] hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Admin Menu - Keep your existing logic */}
      {user && user.status === 'admin' && (
        <section className="bg-white shadow-md">
          <div className="container mx-auto">
            <Menu />
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-60 left-10 w-20 h-20 bg-red-300 rounded-full opacity-60"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-300 rounded-full opacity-50"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-red-300 rounded-full opacity-40"></div>
          {/* <div className="absolute bottom-20 right-25 w-12 h-12 bg-green-300 rounded-full opacity-70"></div> */}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                We're <span className="text-[#030E4F]">Serious</span> For{' '}
                <span className="text-[#030E4F]">Food</span> &{' '}
                <span className="text-red-500">Delivery</span>.
              </h1>
              
              <p className="text-xl mb-8 max-w-lg">
                Best cooks and best delivery guys all at your service. Hot tasty food will reach you in 60 minutes.
              </p>
            </div>

            {/* Right Content - Food Image */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={istockphoto}
                  alt="Delicious Food" 
                  className="w-full max-w-lg mx-auto"
                />
              </div>
              {/* Decorative elements around food */}
              <div className="absolute bottom-100 right-0 w-20 h-20 bg-yellow-200 rounded-full opacity-70 animate-bounce"></div>
              <div className="absolute bottom-100 left-0 w-16 h-16 bg-red-400 rounded-full opacity-60 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>


      {/* Main Menu Section - Your existing MainLayout */}
      <section id="menu" className="py-16 bg-red-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#030E4F] mb-4">
              <span className="text-[#F49F1C]">Menu</span> that <span className="text-red-500">always</span> make you fall in <span className="text-[#030E4F]">love</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
            </p>
          </div>
          <MainLayout cartItems={cartItems} setCartItems={setCartItems} user={user} />
        </div>
      </section>

      {/* Why the dorm chef Section */}
      <section id="why-foodhut" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={istockphoto} 
                alt="About Us" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-[#030E4F] mb-6">
                We are <span className="text-[#F49F1C]">more</span> than <span className="text-red-500">multiple</span> service
              </h2>
              <p className="text-gray-600 mb-8">
                This is a type of restaurant which typically serves food and drink, in addition to light refreshments such as baked goods or snacks. The term comes from the French word meaning food
              </p>

            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-[#030E4F] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Foodhut</h3>
              <p className="text-gray-300 mb-6">
                This is a type of restaurant which typically serves food and drink, in addition to light refreshments such as baked goods or snacks. The term comes from the Myanmar word meaning food
              </p>

            </div>
            
            <div>
              <h4 className="font-semibold mb-4">About Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>

                <li><a href="#" className="hover:text-white">Contact</a></li>

              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Partnership</a></li>
                <li><a href="#" className="hover:text-white">Terms of Use</a></li>

              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Get in touch</h4>
              <p className="text-gray-300 mb-4">
                Keep in touch with us via email.
              </p>
              {/* <div className="flex">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-4 py-2 rounded-l bg-gray-700 text-white border-none outline-none"
                />
                <button className="px-6 py-2 bg-[#F49F1C] text-white rounded-r hover:bg-opacity-90 transition-colors">
                  Subscribe
                </button>
              </div> */}
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 The Dorm Chef. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

