import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { EyeOutlined } from "@ant-design/icons";
import { AuthInput } from "./AuthInput";
import { AuthToggle } from "./AuthToggle";
import { AuthButtons } from "./AuthButtons";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

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
  onFogot: (status: boolean) => void;
}

const passwordCriteria = {
  minLength: { check: (pwd: string) => pwd.length >= 8, label: "At least 8 characters" },
  hasUppercase: { check: (pwd: string) => /[A-Z]/.test(pwd), label: "Uppercase" },
  hasLowercase: { check: (pwd: string) => /[a-z]/.test(pwd), label: "Lowercase" },
  hasNumber: { check: (pwd: string) => /[0-9]/.test(pwd), label: "Number" },
  hasSpecial: { check: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), label: "Special characters" },
};

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
  onFogot
}) => {
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    const checks = Object.values(passwordCriteria).map(criterion => criterion.check(password));
    const passedChecks = checks.filter(Boolean).length;
    
    if (passedChecks <= 1) return { level: "weak", color: "bg-red-500", width: "w-1/4", text: "Yếu" };
    if (passedChecks <= 3) return { level: "medium", color: "bg-yellow-500", width: "w-1/2", text: "Trung bình" };
    if (passedChecks <= 4) return { level: "strong", color: "bg-green-500", width: "w-3/4", text: "Mạnh" };
    return { level: "very-strong", color: "bg-green-600", width: "w-full", text: "Rất mạnh" };
  }, [password]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && passwordStrength.level === "weak") {
      return;
    }
    handleSubmit(e);
  };

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

      <form className="space-y-6" onSubmit={handleFormSubmit}>
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

          {/* Password Strength Indicator */}
          {!isLogin && password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4"
            >
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-500 ${passwordStrength.width}`}
                />
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className={`text-sm ${passwordStrength.color.replace('bg-', 'text-')}`}>
                  Độ mạnh: {passwordStrength.text}
                </span>
              </div>

              {/* Password Requirements */}
              <div className="mt-4 space-y-2">
                {Object.entries(passwordCriteria).map(([key, { check, label }]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      check(password) ? 'bg-green-500' : 'bg-white/20'
                    }`}>
                      {check(password) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${check(password) ? 'text-white' : 'text-white/60'}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Warning for weak password */}
              {passwordStrength.level === "weak" && (
                <Alert className="mt-4 bg-red-500/20 border-red-500 text-white">
                  <AlertTitle>Mật khẩu quá yếu</AlertTitle>
                  <AlertDescription>
                    Vui lòng tạo mật khẩu mạnh hơn để bảo vệ tài khoản của bạn.
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}
        </motion.div>

        {isLogin && (
          <div className="flex justify-end" onClick={() => onFogot(true)}>
            <a href="#" className="text-white/80 hover:text-white text-sm">
              Forgot your password?
            </a>
          </div>
        )}

        <AuthButtons
          isLogin={isLogin}
          onSubmit={handleFormSubmit}
          onGoogleLogin={handleGoogleLogin}
          isSuccess={isSuccess}
          isDisabled={!isLogin && (passwordStrength.level === "weak" || passwordStrength.level === "medium")}
        />
      </form>

      <AuthToggle isLogin={isLogin} onToggle={toggleAuthMode} />
    </motion.div>
  );
};
