import React from 'react';
import './output.css';

const Form: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-start bg-white">
      <div className="flex w-full h-screen">
        {/* Left Side - Login Form */}
        <div className="w-1/2 h-full flex flex-col justify-center p-16">
          <div className="w-full max-w-lg mx-auto"> 
            <div className="mb-6 flex items-center">
              <img src="/img/logo.png" alt="Logo" className="w-12 h-12" /> 
              <span className="ml-4 text-2xl font-bold">Freelance Marketplace</span> 
            </div>
            <h2 className="text-3xl font-bold">Sign in to your account</h2> 
            <p className="text-gray-500 mb-4">Experience the power of networking</p> 
            <form className="space-y-6 mt-4">
              <div>
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
                <div className="text-right">
                  <a href="#" className="text-sm text-blue-600 hover:underline">Forgot your password?</a>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="ml-2 text-gray-700">Remember me</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Sign in
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center bg-gray-100 border border-gray-300 py-2 rounded-md mt-2 hover:bg-gray-200 transition"
              >
                <img src="/img/google.png" alt="Google Logo" className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
            </form>
            <div className="mt-6">
              <p className="text-gray-500">
                Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 h-full relative p-4">
          <img
            src="/img/login.png"
            alt="Decorative"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Form;
