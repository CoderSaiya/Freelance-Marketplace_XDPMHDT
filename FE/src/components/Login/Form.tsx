import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLoginUserMutation,
  useLoginGoogleMutation,
} from "../../apis/restfulApi";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../../store/authSlice";
import { useDispatch } from "react-redux";

const Form: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPass, setIsShowPass] = useState(false);
  const [loginUser] = useLoginUserMutation();
  const [loginGoogle, { data, error, isSuccess }] = useLoginGoogleMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  // const { data, error, refetch } = useGoogleCallbackQuery(code ?? '', {
  //   skip: !code,
  // });

  // useEffect(() => {
  //   if (data && data.token) {
  //     localStorage.setItem('access-token', data.token)
  //     navigate('/');
  //   }
  // }, [data, dispatch, navigate]);

  // useEffect(() => {
  //   if (error) {
  //     console.error('OAuth callback failed:', error);
  //   }
  // }, [error]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        username,
        password,
      }).unwrap();

      console.log("API Response:", response);

      const { accessToken: accessToken, refreshToken: refreshToken } =
        response.data;
      if (!accessToken || !refreshToken) {
        console.error("Tokens not found in response");
      }

      if (accessToken) {
        const decodedToken: any = jwtDecode(accessToken);
        const userId = decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
        const userName = decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];

        // console.log(userId);

        dispatch(setUser({ userId, username: userName }));

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh", refreshToken);

        // console.log("User ID:", userId);
        // console.log("Username:", userName);
      }

      notification.success({
        message: "Successfully login",
      });
      navigate("/");
    } catch (error) {
      notification.error({
        message: "Failed login",
      });
      console.error("Login failed:", error);
    }
  };

  const handleLoginGoogle = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=838128278169-ug2l134id0g6krlkhiklt8u606iln46u.apps.googleusercontent.com&redirect_uri=http://localhost:5173/auth/callback&response_type=code&scope=openid email profile`;

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Mở cửa sổ nhỏ để đăng nhập Google
    const googleWindow = window.open(
      googleAuthUrl,
      "Google Sign-In",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // Theo dõi khi cửa sổ pop-up đóng
    const interval = setInterval(() => {
      if (googleWindow && googleWindow.closed) {
        clearInterval(interval);
        // Kiểm tra nếu cửa sổ đăng nhập bị đóng
        console.log("Google window closed");
        // Xử lý sau khi đăng nhập thành công
      }
    }, 1000);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Call your loginGoogle mutation with the Google code
      loginGoogle(code);
    }
  }, [loginGoogle]);

  useEffect(() => {
    if (isSuccess && data) {
      const { accessToken, refreshToken } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      notification.success({
        message: "Succcesfully login",
      });
      navigate("/");
    }
  }, [isSuccess, data, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70]">
      <motion.div 
        className="w-full max-w-6xl mx-4 h-[750px] relative bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative w-full h-full flex">
          {/* Form Container */}
          <AnimatePresence initial={false} mode="wait" custom={isLogin ? 1 : -1}>
            <motion.div
              key={isLogin ? "login" : "register"}
              className="absolute top-0 left-0 w-full h-full flex"
              custom={isLogin ? 1 : -1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              {/* Content Side */}
              <div className="w-1/2 h-full p-12 flex flex-col justify-center">
                <motion.div 
                  className="w-full max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center mb-8">
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

                  <form className="space-y-6">
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
                        />
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-white/90 mb-2 font-medium">
                        Username
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                        placeholder="Enter your username"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </motion.div>

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

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="space-y-4 pt-2"
                    >
                      <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-white/90 transform hover:scale-[1.02] transition-all duration-200"
                      >
                        {isLogin ? "Sign in" : "Sign up"}
                      </button>

                      <button
                        type="button"
                        onClick={handleLoginGoogle}
                        className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all duration-200"
                      >
                        <img src="/img/google.png" alt="Google" className="w-5 h-5" />
                        <span>
                          {isLogin ? "Sign in with Google" : "Sign up with Google"}
                        </span>
                      </button>
                    </motion.div>
                  </form>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center text-white/80"
                  >
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-white font-semibold hover:text-white/80 transition-colors"
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </button>
                  </motion.p>
                </motion.div>
              </div>

              {/* Image Side */}
              <div className="w-1/2 h-full p-12 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full h-full relative rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm"></div>
                  <img
                    src="/img/login.png"
                    alt="Decorative"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Form;
