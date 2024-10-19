import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const isLogin = localStorage.getItem("access_token") === null;
  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Logo */}
      <Link to={"/"}>
        <div className="flex items-center gap-2">
          <img src="/img/logo.png" alt="Logo" className="w-12 h-12" />
          <span className="text-xl font-bold text-gray-900">
            Freelance Marketplace
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex items-center" style={{ gap: "1.5rem" }}>
        {isLogin ? (
          <>
            <Link to={"/login"}>
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                Log in
              </button>
            </Link>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
              Sign up
            </button>
          </>
        ) : (
          <>
            <button className="flex items-center">
              <img
                src="/img/logo.png"
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">Log out</button>
          </>
        )}
        ;
      </div>
    </nav>
  );
};

export default Navbar;
