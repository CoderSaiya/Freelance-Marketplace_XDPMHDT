import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLoginUserMutation,
  useLoginGoogleMutation,
  useRegisterUserMutation,
} from "../../apis/restfulApi";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { RegisterReq } from "@/types";
import { AuthLayout } from "./AuthLayout";
import { AuthForm } from "./AuthForm";
import { ImageSide } from "./ImageSide";

const Form: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const role = urlParams.get("role");
  const isRegister = urlParams.get("isRegister") === "true";

  const [isLogin, setIsLogin] = useState(!isRegister);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isShowPass, setIsShowPass] = useState(false);
  const [loginUser] = useLoginUserMutation();
  const [registerUser] = useRegisterUserMutation();
  const [loginGoogle, { data, error, isSuccess }] = useLoginGoogleMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  

  useEffect(() => {
    if (!role && !isLogin) {
      navigate("/welcome");

      setTimeout(() => {
        setIsLogin(false);
      }, 3000);
    }
  }, [isLogin, navigate, role]);

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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const registBody: RegisterReq = {
      username: username,
      password: password,
      email: email,
      role: role || "Client",
    };

    try {
      await registerUser(registBody).unwrap();

      notification.success({
        message: "Sucessfully!!!",
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Failed: " + error,
      });
    }
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
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        const userName =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ];

        dispatch(setUser({ userId, username: userName }));

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh", refreshToken);
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
    <AuthLayout>
      <div className="relative w-full h-full flex">
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
              <AuthForm
                isLogin={isLogin}
                username={username}
                password={password}
                email={email}
                isShowPass={isShowPass}
                setEmail={setEmail}
                setUsername={setUsername}
                setPassword={setPassword}
                setIsShowPass={setIsShowPass}
                handleSubmit={isLogin ? handleLogin : handleSignup}
                handleGoogleLogin={handleLoginGoogle}
                toggleAuthMode={() => setIsLogin(!isLogin)}
              />
            </div>

            {/* Image Side */}
            <ImageSide />
          </motion.div>
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
};

export default Form;
