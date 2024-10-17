import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/img/logo.png" alt="Logo" className="w-12 h-12" />
        <span className="text-xl font-bold text-gray-900">Freelance Marketplace</span>
      </div>

      {/* Navigation */}
      <div className="flex items-center" style={{ gap: '1.5rem' }}>
        <button className="text-gray-600 hover:text-gray-900 font-medium">
          Log in
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
          Sign up
        </button>
        <button className="flex items-center">
          <img
            src="/img/logo.png"
            alt="User Avatar"
            className="w-12 h-12 rounded-full"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
