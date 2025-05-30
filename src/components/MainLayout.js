
// import React, { useState, useEffect } from 'react';
// import { getAllMenuItems } from '../services/menuApi';
// import { useNavigate } from 'react-router-dom';

// export default function MainLayout({ cartItems, setCartItems }) {
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showCheckout, setShowCheckout] = useState(false);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const navigate = useNavigate();

//   const categories = ['All', 'Ramen', 'Breakfast', 'Lunch', 'Dinner'];

//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       try {
//         const data = await getAllMenuItems();
//         console.log('Menu items fetched:', data);
//         setMenuItems(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchMenuItems();
//   }, []);

//   const addToCart = (item) => {
//     const itemId = item.$id || item.id || item.menu_id;
//     console.log('Using itemId:', itemId);
    
//     if (!itemId) {
//       console.error('No valid ID found for item:', item);
//       alert('Error: Item ID not found');
//       return;
//     }
    
//     const existingItemIndex = cartItems.findIndex(cartItem => {
//       const cartItemId = cartItem.$id || cartItem.id || cartItem.menu_id;
//       console.log('Comparing:', cartItemId, 'with', itemId);
//       return cartItemId === itemId;
//     });
    
//     console.log('Existing item index:', existingItemIndex);
    
//     if (existingItemIndex >= 0) {
//       const updatedCart = cartItems.map((cartItem, index) => 
//         index === existingItemIndex 
//           ? { ...cartItem, quantity: cartItem.quantity + 1 }
//           : cartItem
//       );
//       console.log('Updating existing item quantity. Updated cart:', updatedCart);
//       setCartItems(updatedCart);
//     } else {
//       const newCartItem = { ...item, quantity: 1 };
//       const newCart = [...cartItems, newCartItem];
//       console.log('Adding new item to cart:', newCartItem);
//       console.log('New cart state:', newCart);
//       console.log('Total unique items in cart:', newCart.length);
//       setCartItems(newCart);
//     }
    
//     // console.log('=== END ADD TO CART DEBUG ===');
//     setShowCheckout(true);
//   };

//   const handleCheckout = () => {
//     navigate('/checkout');
//   };

//   const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   if (loading) return (
//     <div className="flex justify-center items-center min-h-64">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F49F1C]"></div>
//     </div>
//   );
  
//   if (error) return (
//     <div className="flex justify-center items-center min-h-64 text-red-500">
//       <div className="text-center">
//         <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//         <p>Error: {error}</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="w-full">
      
//       {/* Category Filter */}
//       {/* <div className="mb-12">
//         <div className="flex flex-wrap justify-center gap-4">
//           {categories.map((category) => (
//             <button
//               key={category}
//               onClick={() => setActiveCategory(category)}
//               className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
//                 activeCategory === category
//                   ? 'bg-[#F49F1C] text-white shadow-lg transform scale-105'
//                   : 'bg-white text-gray-700 border border-gray-200 hover:border-[#F49F1C] hover:text-[#F49F1C]'
//               }`}
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//       </div> */}

//       {/* Menu Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {menuItems.map((item) => (
//           <div key={item.$id || item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
//             {/* Food Image */}
//             <div className="relative h-48 overflow-hidden">
//               <img 
//                 src={item.image_url || '/api/placeholder/300/200'} 
//                 alt={item.name}
//                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//               />
//               {/* Price Badge */}
//               {/* <div className="absolute top-4 right-4 bg-[#F49F1C] text-white px-3 py-1 rounded-full font-bold text-lg shadow-lg">
//                 ${item.price}
//               </div> */}
//               {/* Rating Badge */}
//               {/* <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center space-x-1">
//                 <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
//                   <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
//                 </svg>
//                 <span className="text-sm font-medium">4.5</span>
//               </div> */}
//             </div>

//             {/* Card Content */}
//             <div className="p-6">
//               <h3 className="text-xl font-bold text-[#030E4F] mb-2">{item.name}</h3>
//               <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

//               <div className="flex items-center justify-between mb-4">
//                 <span className="text-sm text-gray-500 flex items-center">
//                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   {item.prepTime} mins
//                 </span>
                
//                 {/* Rating stars */}
//                 <div className="flex items-center space-x-1">
//                   {/* {[...Array(3)].map((_, i) => (
//                     <div key={i} className="w-6 h-6 rounded-full bg-gray-200"></div>
//                   ))} */}
//                   ${item.price}
//                 </div>
//               </div>

//               {/* Order Button */}
//               <button 
//                 onClick={() => addToCart(item)}
//                 className="w-full py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 group-hover:bg-[#F49F1C]"
//                 style={{ backgroundColor: '#0304ef',   
//                   color: '#e49f1c','--hover-bg': '#0203b8','--hover-text': '#c58c19'}}
//               >
//                 <span>Order Now</span>
//                 {(() => {
//                   const itemId = item.$id || item.id || item.menu_id;
//                   const cartItem = cartItems.find(cartItem => {
//                     const cartItemId = cartItem.$id || cartItem.id || cartItem.menu_id;
//                     return cartItemId === itemId;
//                   });
//                   return cartItem ? (
//                     <span className="bg-white text-[#030E4F] px-2 py-1 rounded-full text-xs font-bold">
//                       {cartItem.quantity}
//                     </span>
//                   ) : null;
//                 })()}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Floating Cart Preview - Enhanced Design */}
//       {cartItems.length > 0 && (
//         <div className="fixed bottom-6 right-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-sm z-50">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-bold text-xl text-[#030E4F]">Your Cart</h3>
//             <div className="bg-[#F49F1C] text-white text-sm font-bold px-3 py-1 rounded-full">
//               {totalItems}
//             </div>
//           </div>
          
//           <div className="text-sm text-gray-600 mb-4">
//             {cartItems.length} unique item{cartItems.length !== 1 ? 's' : ''} • {totalItems} total
//           </div>
          
//           <div className="max-h-32 overflow-y-auto mb-4">
//             {cartItems.map((item, index) => (
//               <div key={index} className="flex justify-between items-center text-xs text-gray-600 py-1">
//                 <span>{item.name}</span>
//                 <span className="font-semibold">×{item.quantity}</span>
//               </div>
//             ))}
//           </div>
          
//           <button onClick={handleCheckout}
//               className="w-full font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
//               style={{ backgroundColor: '#0304ef',   
//                 color: '#e49f1c','--hover-bg': '#0203b8','--hover-text': '#c58c19'}}>
//               <span className="transition-colors duration-300 hover:text-[var(--hover-text)]">
//                 Proceed to Checkout
//               </span>
//               <svg 
//                 className="w-5 h-5 transition-colors duration-300 hover:text-[var(--hover-text)]" 
//                 fill="currentColor" 
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { getAllMenuItems } from '../services/menuApi';
import { useNavigate } from 'react-router-dom';

export default function MainLayout({ cartItems, setCartItems }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner'];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await getAllMenuItems();
        console.log('Menu items fetched:', data);
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const addToCart = (item) => {
    const itemId = item.$id || item.id || item.menu_id;
    console.log('Using itemId:', itemId);
    
    if (!itemId) {
      console.error('No valid ID found for item:', item);
      alert('Error: Item ID not found');
      return;
    }
    
    const existingItemIndex = cartItems.findIndex(cartItem => {
      const cartItemId = cartItem.$id || cartItem.id || cartItem.menu_id;
      console.log('Comparing:', cartItemId, 'with', itemId);
      return cartItemId === itemId;
    });
    
    console.log('Existing item index:', existingItemIndex);
    
    if (existingItemIndex >= 0) {
      const updatedCart = cartItems.map((cartItem, index) => 
        index === existingItemIndex 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      console.log('Updating existing item quantity. Updated cart:', updatedCart);
      setCartItems(updatedCart);
    } else {
      const newCartItem = { ...item, quantity: 1 };
      const newCart = [...cartItems, newCartItem];
      console.log('Adding new item to cart:', newCartItem);
      console.log('New cart state:', newCart);
      console.log('Total unique items in cart:', newCart.length);
      setCartItems(newCart);
    }
    
    console.log('=== END ADD TO CART DEBUG ===');
    setShowCheckout(true);
  };

  // NEW: Remove item from cart function
  const removeFromCart = (item) => {
    const itemId = item.$id || item.id || item.menu_id;
    
    const existingItemIndex = cartItems.findIndex(cartItem => {
      const cartItemId = cartItem.$id || cartItem.id || cartItem.menu_id;
      return cartItemId === itemId;
    });
    
    if (existingItemIndex >= 0) {
      const currentItem = cartItems[existingItemIndex];
      
      if (currentItem.quantity > 1) {
        // Decrease quantity by 1
        const updatedCart = cartItems.map((cartItem, index) => 
          index === existingItemIndex 
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
        setCartItems(updatedCart);
      } else {
        // Remove item completely if quantity is 1
        const updatedCart = cartItems.filter((_, index) => index !== existingItemIndex);
        setCartItems(updatedCart);
      }
    }
  };

  // NEW: Remove entire item from cart (regardless of quantity)
  const removeEntireItemFromCart = (item) => {
    const itemId = item.$id || item.id || item.menu_id;
    
    const updatedCart = cartItems.filter(cartItem => {
      const cartItemId = cartItem.$id || cartItem.id || cartItem.menu_id;
      return cartItemId !== itemId;
    });
    
    setCartItems(updatedCart);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F49F1C]"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-64 text-red-500">
      <div className="text-center">
        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Debug Cart Info - Keep your existing debug */}
      {cartItems.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-sm">
          <strong className="text-yellow-800">Cart Debug Info:</strong>
          <br />Total unique items: {cartItems.length}
          <br />Total quantity: {totalItems}
          <br />Total price: ${totalPrice.toFixed(2)}
          <br />Cart items:
          {cartItems.map((item, index) => (
            <div key={index} className="ml-4 text-yellow-700">
              - {item.name} (ID: {item.$id || item.id || item.menu_id || 'NO_ID'}, Qty: {item.quantity}, Price: ${(item.price * item.quantity).toFixed(2)})
            </div>
          ))}
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                activeCategory === category
                  ? 'bg-[#F49F1C] text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#F49F1C] hover:text-[#F49F1C]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div key={item.$id || item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
            {/* Food Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={item.image_url || '/api/placeholder/300/200'} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Rating Badge */}
              {/* <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-sm font-medium">4.5</span>
              </div> */}
            </div>

            {/* Card Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#030E4F] mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item.prepTime} mins
                </span>
                  {/* Price Badge */}

                  ${item.price}

              </div>

              {/* Order Button */}
              <button 
                onClick={() => addToCart(item)}
                className="w-full bg-[#030E4F] py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 group-hover:bg-[#F49F1C]"
                style={{ backgroundColor: '#0304ef', color: '#e49f1c','--hover-bg': '#0203b8','--hover-text': '#c58c19'}}
              >
                <span>Order Now</span>
                {(() => {
                  const itemId = item.$id || item.id || item.menu_id;
                  const cartItem = cartItems.find(cartItem => {
                    const cartItemId = cartItem.$id || cartItem.id || cartItem.menu_id;
                    return cartItemId === itemId;
                  });
                  return cartItem ? (
                    <span className="bg-white text-[#030E4F] px-2 py-1 rounded-full text-xs font-bold">
                      {cartItem.quantity}
                    </span>
                  ) : null;
                })()}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Floating Cart Preview with Remove Options */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-sm z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-[#030E4F]">Your Cart</h3>
            <div className="bg-[#F49F1C] text-white text-sm font-bold px-3 py-1 rounded-full">
              {totalItems}
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            {cartItems.length} unique item{cartItems.length !== 1 ? 's' : ''} • {totalItems} total
          </div>
          
          {/* Cart Items with Remove Options */}
          <div className="max-h-64 overflow-y-auto mb-4 space-y-2">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm text-[#030E4F]">{item.name}</div>
                  <div className="text-xs text-gray-500">${item.price} each</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Decrease quantity button */}
                  <button
                    onClick={() => removeFromCart(item)}
                    className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <span className="font-semibold text-sm w-8 text-center">{item.quantity}</span>
                  
                  {/* Increase quantity button */}
                  <button
                    onClick={() => addToCart(item)}
                    className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  
                  {/* Remove entire item button */}
                  <button
                    onClick={() => removeEntireItemFromCart(item)}
                    className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Total Price */}
          <div className="border-t pt-3 mb-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span className="text-[#030E4F]">Total:</span>
              <span className="text-[#F49F1C]">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={handleCheckout}
            className="w-full bg-[#F49F1C] hover:bg-[#e8900c] text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

