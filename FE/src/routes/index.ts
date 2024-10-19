import GoogleCallback from "../pages/auth/GoogleCallback";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProfilePage from "../pages/Profile";
import { RouteType } from "../types";

const publicRoute: RouteType[] = [
  {
    path: "/",
    component: Home,
  },


  {
    path: "/login",
    component: Login,
    
  },

  {
    path:"/auth/callback",
    component: GoogleCallback,
  },

  
  {
    path: "/profile",
    component: ProfilePage,
  }
//   {
//     path: "/chat",
//     component: ChatPage,
//     layout: NoLayout,
//   },
//   {
//     path: "/ads",
//     component: AdsPage,
//   },
//   {
//     path: "/admin",
//     component: AdminPage,
//     layout: AdminLayout,
//   },
//   {
//     path: "/auth/login",
//     component: LoginPage,
//   },
//   {
//     path: "/auth/register",
//     component: RegisterPage,
//   },
//   {
//     path: "/product",
//     component: ProductPage,
//   },
//   {
//     path: "/product/productDetail/:id",
//     component: ProductDetailPage,
//   },
//   {
//     path: "/post",
//     component: PostPage,
//   },
];

const privateRoute: RouteType[] = [
];

export { privateRoute, publicRoute };
