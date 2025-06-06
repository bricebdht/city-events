import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200">
            Social Activities
          </Link>
          <div className="space-x-4">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            <Link to="/map" className="hover:text-blue-200">Map</Link>
            <Link to="/create" className="bg-yellow-400 text-blue-800 px-3 py-2 rounded-md font-semibold hover:bg-yellow-300">
              Create Activity
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Social Activities Florianópolis</p>
      </footer>
    </div>
  );
};

export default Layout;
