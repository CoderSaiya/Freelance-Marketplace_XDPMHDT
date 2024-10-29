// import React, { useState } from "react";
// import { useLoginUserMutation } from "../../apis/restfulApi";
// import { jwtDecode } from "jwt-decode";
// import { useDispatch } from "react-redux";
// import { setUser } from "../../store/authSlice";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loginUser] = useLoginUserMutation();
//   const dispatch = useDispatch();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const data = await loginUser({ username, password }).unwrap();
//       console.log("Login success:", data);

//       const token = data.accessToken;
//       console.log(token);
//       if (token) {
//         const decodedToken: any = jwtDecode(token);
//         const userId =
//           decodedToken[
//             "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
//           ];
//         const userName =
//           decodedToken[
//             "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
//           ];

//         console.log(userId);

//         dispatch(setUser({ userId: userId, username: userName }));

//         console.log("User ID:", userId);
//         console.log("Username:", userName);
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="Username"
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Login;
