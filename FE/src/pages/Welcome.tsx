import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: string) => {
    navigate(`/login?state=${role}&isRegister=true`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70]">
      <motion.div
        className="p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold text-white mb-4">Welcome!</h1>
        <p className="text-white/80 mb-8">Select your role to get started:</p>
        <div className="space-y-4">
          <button
            className="w-full py-3 bg-white/90 rounded-xl text-purple-600 font-semibold"
            onClick={() => handleRoleSelection("Client")}
          >
            I'm a Client
          </button>
          <button
            className="w-full py-3 bg-white/90 rounded-xl text-purple-600 font-semibold"
            onClick={() => handleRoleSelection("Freelancer")}
          >
            I'm a Freelancer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;