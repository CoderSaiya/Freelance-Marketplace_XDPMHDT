import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";

export const EmailVerification = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  // Simulate verification process
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderStatus = () => {
    if (isVerifying) {
      return (
        <div className="text-center">
          <LoadingOutlined spin className="text-5xl text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Verifying Your Email
          </h3>
          <p className="text-white/70">
            Please wait while we confirm your email address...
          </p>
        </div>
      );
    }

    if (isVerified) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleOutlined className="text-5xl text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Email Verified!
          </h3>
          <p className="text-white/70 mb-8">
            Your email has been successfully verified. You can now access all
            features.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
          >
            Continue to Login
          </button>
        </motion.div>
      );
    }

    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          Verification Failed
        </h3>
        <p className="text-white/70 mb-6">
          Sorry, we couldn't verify your email. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          Retry Verification
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
      >
        <div className="flex justify-center mb-8">
          <img src="/img/logo.png" alt="Logo" className="w-16 h-16" />
        </div>
        {renderStatus()}
      </motion.div>
    </div>
  );
};
