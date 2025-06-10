/////////
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutLayout({ cartItems, setCartItems }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    whatsapp: '',
    pickup_station: '',
    photo: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If no items in cart, redirect back to main page
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  console.log('CheckoutLayout received cartItems:', cartItems); 

  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for the order submission
      const orderFormData = new FormData();
      
      // Add customer information
      orderFormData.append('customer_name', formData.name);
      orderFormData.append('customer_address', formData.address);
      orderFormData.append('whatsapp_number', formData.whatsapp);
      orderFormData.append('pickup_station', formData.pickup_station);
      
      // Prepare menu order data - use the correct ID field
      const menuOrderData = cartItems.map(item => {
        console.log('Processing cart item for order:', item);
        const itemId = item.$id || item.id || item.menu_id;
        console.log('Using item ID:', itemId);
        return {
          menu_id: itemId,
          quantity: item.quantity
        };
      });
      
      console.log('Menu order data being sent:', menuOrderData);
      
      // Convert to JSON string for transmission
      const menuOrderString = JSON.stringify(menuOrderData);
      console.log('Menu order JSON string:', menuOrderString);
      
      orderFormData.append('menu_order', menuOrderString);
      
      // Add photo if provided
      if (formData.photo) {
        orderFormData.append('image', formData.photo);
      }

      console.log('Submitting order...');

      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        body: orderFormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit order');
      }

      const result = await response.json();
      console.log('Order submitted successfully:', result);
      
      alert('Order placed successfully!');
      setCartItems([]); // Clear cart
      navigate('/'); // Navigate back to menu
      
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`Failed to submit order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>


      {/* Cart Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Your Order</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Item</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Price</th>
                <th className="py-2 px-4 border">Quantity</th>
                <th className="py-2 px-4 border">Subtotal</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={`${item.$id || item.id || item.menu_id}-${index}`}>
                  <td className="py-2 px-4 border">
                    {item.name}
                    <br />
                    <small className="text-gray-500">ID: {item.$id || item.id || item.menu_id || 'NO_ID'}</small>
                  </td>
                  <td className="py-2 px-4 border text-sm">{item.description}</td>
                  <td className="py-2 px-4 border">${item.price.toFixed(2)}</td>
                  <td className="py-2 px-4 border">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded text-xs"
                      >
                        -
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded text-xs"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-4 border">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="py-2 px-4 border">
                    <button 
                      onClick={() => removeItem(index)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-50">
                <td className="py-2 px-4 border" colSpan="4">Total</td>
                <td className="py-2 px-4 border">${total.toFixed(2)}</td>
                <td className="py-2 px-4 border"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Customer Info Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Name *</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Address *</label>
          <textarea 
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">WhatsApp Number *</label>
          <input 
            type="tel" 
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="+1234567890"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Pick-up Station *</label>
          <input 
            type="text" 
            name="pickup_station"
            value={formData.pickup_station}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Upload Photo (Optional)</label>
          <input 
            type="file" 
            onChange={handlePhotoUpload}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            accept="image/*"
          />
          {formData.photo && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {formData.photo.name}
            </p>
          )}
        </div>
        
        <div className="flex space-x-4 pt-4">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            Back to Menu
          </button>
          <button 
            type="submit" 
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}

