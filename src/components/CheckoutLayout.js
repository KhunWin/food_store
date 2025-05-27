import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutLayout({ cartItems }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    whatsapp: '',
    photo: null
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    // If no items in cart, redirect back to main page
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  console.log('CheckoutLayout received cartItems:', cartItems); 
  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoUpload = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process order submission here
    console.log('Order submitted:', { items: cartItems, customer: formData });
    alert('Order placed successfully!');
    // You would typically send this data to your backend
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {/* Cart Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Your Order</h3>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Item</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border">{item.name}</td>
                <td className="py-2 px-4 border text-sm">{item.description}</td>
                <td className="py-2 px-4 border">${item.price.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="font-semibold bg-gray-50">
              <td className="py-2 px-4 border" colSpan="2">Total</td>
              <td className="py-2 px-4 border">${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Customer Info Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1">Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Address</label>
          <textarea 
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">WhatsApp Number</label>
          <input 
            type="tel" 
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Upload Photo (Optional)</label>
          <input 
            type="file" 
            onChange={handlePhotoUpload}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
        </div>
        
        <div className="flex space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
          >
            Back to Menu
          </button>
          <button 
            type="submit" 
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}