import React, { useState } from "react";
import { motion } from "framer-motion";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface Props {
  onForgot: (status: boolean) => void;
}

const ForgotPassword: React.FC<Props> = ({ onForgot }) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Add API call here
  };

  return (
    <div className="w-full h-full flex">
      <div className="w-1/2 h-full p-12 flex flex-col justify-center">
        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => onForgot(false)}
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeftOutlined className="mr-2" /> Back to Login
          </button>

          <div className="mb-8">
            <div
              className="flex items-center mb-8 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src="/img/logo.png" alt="Logo" className="w-12 h-12" />
              <h1 className="ml-4 text-2xl font-bold text-white">
                Freelance Marketplace
              </h1>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Reset Password
            </h2>
            <p className="text-white/80">
              Don't worry! Enter your email and we'll send you reset
              instructions.
            </p>
          </div>

          {!isSubmitted ? (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <label className="block text-white/90 mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-white/90 transform hover:scale-[1.02] transition-all duration-200"
              >
                Send Reset Instructions
              </button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white/10 rounded-2xl p-8 border border-white/20"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MailOutlined className="text-3xl text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Check Your Email
              </h3>
              <p className="text-white/70 mb-6">
                We've sent password reset instructions to {email}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Didn't receive the email? Click to resend
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Image Side */}
      <div
        className="w-1/2 h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/img/auth-bg.jpg')" }}
      >
        <div className="w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center text-white max-w-md p-8">
            <h2 className="text-3xl font-bold mb-4">Secure Account Recovery</h2>
            <p className="text-lg text-white/80">
              We prioritize your account security. Follow the instructions sent
              to your email to safely reset your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
