// LandingPage.jsx
import React from 'react';
import MainLayout from './MainLayout';
import Menu from './Menu';

export default function LandingPage({ cartItems, setCartItems }) {
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Header with logo */}
      <header className="bg-green-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-12 mr-4" />
          <h1 className="text-2xl font-bold">Delicious Food</h1>
        </div>
      </header>

      {/* Menu component for adding menu items */}
      <section className="bg-white shadow-md my-4">
        <Menu />
      </section>

      {/* Main content with menu items */}
      <main className="flex-grow container mx-auto p-4">
        <MainLayout cartItems={cartItems} setCartItems={setCartItems} />
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>© 2025 Delicious Food. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}