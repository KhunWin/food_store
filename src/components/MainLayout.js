
import React, { useState, useEffect } from 'react';
import { getAllMenuItems } from '../services/menuApi';
import { useNavigate } from 'react-router-dom';

export default function MainLayout({ cartItems, setCartItems }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await getAllMenuItems();
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
    const newCart = [...cartItems, item];
    console.log('Adding to cart:', item); // Debug log
    console.log('New cart state:', newCart); // Debug log
    setCartItems(newCart);
    setShowCheckout(true);
    console.log('Cart updated:', newCart);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img 
                src={item.imageUrl || '/logo.svg'} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600 mt-1">{item.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="font-bold">${item.price}</span>
                <span className="text-sm text-gray-500">{item.prepTime} mins</span>
              </div>
              <button 
                onClick={() => addToCart(item)}
                className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Preview */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Your Cart</h3>
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {cartItems.length}
            </span>
          </div>
          <button 
            onClick={handleCheckout}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}