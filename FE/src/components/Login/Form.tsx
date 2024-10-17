import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Form: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.8, x: 0 },
    visible: { opacity: 1, scale: 1, x: isLogin ? '0%' : '100%' },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, x: 0 },
    visible: { opacity: 1, scale: 1, x: isLogin ? '0%' : '-100%' },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white overflow-hidden">
      <div className="relative w-full max-w-5xl h-[600px] flex">
        
        {/* Form */}
        <motion.div 
          className="w-1/2 h-full flex flex-col justify-center p-16 bg-white"
          initial="hidden"
          animate="visible"
          variants={formVariants}
          transition={{ type: 'spring', stiffness: 150, damping: 80, duration: 1.2 }}
        >
          <div className="w-full max-w-lg mx-auto">
            <div className="mb-6 flex items-center">
              <img src="/img/logo.png" alt="Logo" className="w-12 h-12" /> 
              <span className="ml-4 text-2xl font-bold">Freelance Marketplace</span> 
            </div>
            <h2 className="text-3xl font-bold">
              {isLogin ? 'Sign in to your account' : 'Create an account'}
            </h2>
            <p className="text-gray-500 mb-4">
              Experience the power of networking
            </p>
            <form className="space-y-6 mt-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
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
                {isLogin && (
                  <div className="text-right">
                    <a href="#" className="text-sm text-blue-600 hover:underline">Forgot your password?</a>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center bg-gray-100 border border-gray-300 py-2 rounded-md mt-2 hover:bg-gray-200 transition"
                onClick={toggleForm}
              >
                <img src="/img/google.png" alt="Google Logo" className="w-5 h-5 mr-2" />
                {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
              </button>
            </form>
            <div className="mt-6">
              <p className="text-gray-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <a href="#" className="text-blue-600 hover:underline" onClick={toggleForm}>
                  {isLogin ? 'Sign up' : 'Sign in'}
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div 
          className="w-1/2 h-full"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
          transition={{ type: 'spring', stiffness: 150, damping: 80, duration: 1.2 }}
        >
          <img
            src="/img/login.png"
            alt="Decorative"
            className="w-full h-full object-cover rounded-lg shadow-lg opacity-5"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Form;
