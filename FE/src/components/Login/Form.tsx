import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  const formVariants = {
    hidden: { opacity: 0, scale: 0.8, x: 0 },
    visible: { opacity: 1, scale: 1, x: isLogin ? "0%" : "100%" },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, x: 0 },
    visible: { opacity: 1, scale: 1, x: isLogin ? "0%" : "-100%" },
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
    <div className="min-h-screen flex items-center justify-center bg-white overflow-hidden">
      <div className="relative w-full max-w-5xl h-[600px] flex">
        {/* Form */}
        <motion.div
          className="w-1/2 h-full flex flex-col justify-center p-16 bg-white"
          initial="hidden"
          animate="visible"
          variants={formVariants}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 80,
            duration: 1.2,
          }}
        >
          <div className="w-full max-w-lg mx-auto">
            <div className="mb-6 flex items-center">
              <img src="/img/logo.png" alt="Logo" className="w-12 h-12" />
              <span className="ml-4 text-2xl font-bold">
                Freelance Marketplace
              </span>
            </div>
            <h2 className="text-3xl font-bold">
              {isLogin ? "Sign in to your account" : "Create an account"}
            </h2>
            <p className="text-gray-500 mb-4">
              Experience the power of networking
            </p>
            <form className="space-y-6 mt-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              {!isLogin && (
                <div>
                  <label htmlFor="email" className="block text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
              )}
              <div>
                <label htmlFor="username" className="block text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={isShowPass ? "text" : "password"}
                    id="password"
                    className="mt-1 w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setIsShowPass(!isShowPass)}
                  >
                    <EyeOutlined />
                  </button>
                </div>

                {isLogin && (
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                onClick={handleLogin}
              >
                {isLogin ? "Sign in" : "Sign up"}
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center bg-gray-100 border border-gray-300 py-2 rounded-md mt-2 hover:bg-gray-200 transition"
                onClick={handleLoginGoogle}
              >
                <img
                  src="/img/google.png"
                  alt="Google Logo"
                  className="w-5 h-5 mr-2"
                />
                {isLogin ? "Sign in with Google" : "Sign up with Google"}
              </button>
            </form>
            <div className="mt-6">
              <p className="text-gray-500">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline"
                  onClick={toggleForm}
                >
                  {isLogin ? "Sign up" : "Sign in"}
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
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 80,
            duration: 1.2,
          }}
        >
          <img
            src="/img/login.png"
            alt="Decorative"
            className="w-full h-full object-cover rounded-lg shadow-lg "
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Form;
