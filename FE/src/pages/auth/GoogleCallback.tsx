import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginGoogleMutation } from "../../apis/restfulApi";

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const [loginGoogle] = useLoginGoogleMutation();

  useEffect(() => {
    // Lấy mã code từ URL sau khi Google chuyển hướng
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Gọi hàm trao đổi mã để lấy token
      exchangeCodeForToken(code);
    }
  }, []);

  // Hàm trao đổi mã với backend để lấy token
  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await loginGoogle().unwrap();
      const {accessToken: accessToken, refreshToken: refreshToken} = response.data;

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh', refreshToken);

      // Gửi token về trang chính
      if (window.opener) {
        window.opener.postMessage(
          { accessToken, refreshToken },
          "http://localhost:5173"
        );
      }

      // Đóng cửa sổ pop-up sau khi nhận được token
      window.close();
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  return <div>Processing Google login...</div>;
};

export default GoogleCallback;
