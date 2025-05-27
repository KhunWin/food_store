import React, { useState,useEffect } from 'react';
import { Menu, X, Clock, ShoppingBag, Utensils, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllMenuItems } from '../services/menuApi';



const FoodOrderingWebsite = () => {

    // const menuItems = [
    //     {
    //         id: 1,
    //         name: "Fresh Green Salad",
    //         price: 12.99,
    //         description: "Mixed greens with seasonal vegetables, cherry tomatoes, cucumber, and house-made vinaigrette",
    //         category: "Salads",
    //         preparationTime: "10 mins",
    //         calories: "220 kcal",
    //         isVegetarian: true
    //     },
    //     {
    //         id: 2,
    //         name: "Quinoa Veggie Bowl",
    //         price: 14.99,
    //         description: "Nutrient-rich quinoa with roasted vegetables, chickpeas, and tahini dressing",
    //         category: "Bowls",
    //         preparationTime: "15 mins",
    //         calories: "380 kcal",
    //         isVegetarian: true
    //     },
    //     {
    //         id: 3,
    //         name: "Green Smoothie Bowl",
    //         price: 8.99,
    //         description: "Blend of spinach, banana, mango, topped with chia seeds and granola",
    //         category: "Drinks",
    //         preparationTime: "8 mins",
    //         calories: "290 kcal",
    //         isVegetarian: true
    //     },
    //     {
    //         id: 4,
    //         name: "Avocado Toast",
    //         price: 10.99,
    //         description: "Sourdough bread with mashed avocado, poached eggs, and microgreens",
    //         category: "Breakfast",
    //         preparationTime: "12 mins",
    //         calories: "320 kcal",
    //         isVegetarian: true
    //     },
    //     {
    //         id: 5,
    //         name: "Buddha Bowl",
    //         price: 13.99,
    //         description: "Brown rice, sweet potato, kale, edamame, and miso dressing",
    //         category: "Bowls",
    //         preparationTime: "15 mins",
    //         calories: "450 kcal",
    //         isVegetarian: true
    //     },
    //     {
    //         id: 6,
    //         name: "Mediterranean Wrap",
    //         price: 11.99,
    //         description: "Hummus, falafel, mixed greens, and tzatziki in a whole wheat wrap",
    //         category: "Wraps",
    //         preparationTime: "10 mins",
    //         calories: "380 kcal",
    //         isVegetarian: true
    //     }
    // ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="text-center py-8">Loading menu...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <button 
                        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    </div>
                
            </header>

            {/* Menu Items Grid */}
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            
                            {/* Image section */}
                            <div className="h-48 overflow-hidden">
                                <img 
                                    src={'/logo.svg' || item.ImageUrl} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-600">{item.description}</p>
                                
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <Clock className="w-3 h-3 mr-1" /> {item.category}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {item.branch_id}
                                    </span>
                                    {item.availability && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Available
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default FoodOrderingWebsite;