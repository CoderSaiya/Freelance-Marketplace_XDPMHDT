import React from "react";
import { motion } from "framer-motion";
import { EyeOutlined } from "@ant-design/icons";
import { AuthInput } from "./AuthInput";
import { AuthToggle } from "./AuthToggle";
import { AuthButtons } from "./AuthButtons";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  isLogin: boolean;
  username: string;
  password: string;
  email: string;
  isShowPass: boolean;
  setEmail: (value: string) => void;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  setIsShowPass: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
  toggleAuthMode: () => void;
  isSuccess: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  username,
  password,
  email,
  isShowPass,
  setEmail,
  setUsername,
  setPassword,
  setIsShowPass,
  handleSubmit,
  handleGoogleLogin,
  toggleAuthMode,
  isSuccess,
}) => {
  const navigate = useNavigate();
  const toggleHome = () => {
    navigate("/");
  };
  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center mb-8 cursor-pointer" onClick={toggleHome}>
        <img src="/img/logo.png" alt="Logo" className="w-12 h-12" />
        <h1 className="ml-4 text-2xl font-bold text-white">
          Freelance Marketplace
        </h1>
      </div>

      <h2 className="text-4xl font-bold text-white mb-2">
        {isLogin ? "Welcome Back!" : "Create Account"}
      </h2>
      <p className="text-white/80 mb-8">
        {isLogin
          ? "We're excited to see you again!"
          : "Start your journey with us today"}
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-white/90 mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-200"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>
        )}

        <AuthInput
          label="Username"
          value={username}
          onChange={setUsername}
          delay={0.5}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-white/90 mb-2 font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={isShowPass ? "text" : "password"}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsShowPass(!isShowPass)}
            >
              <EyeOutlined />
            </button>
          </div>
        </motion.div>

        {isLogin && (
          <div className="flex justify-end">
            <a href="#" className="text-white/80 hover:text-white text-sm">
              Forgot your password?
            </a>
          </div>
        )}

        <AuthButtons
          isLogin={isLogin}
          onSubmit={handleSubmit}
          onGoogleLogin={handleGoogleLogin}
          isSuccess = {isSuccess}
        />
      </form>

      <AuthToggle isLogin={isLogin} onToggle={toggleAuthMode} />
    </motion.div>
  );
};
