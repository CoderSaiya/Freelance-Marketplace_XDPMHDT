import GoogleCallback from "../pages/auth/GoogleCallback";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProfilePage from "../pages/Profile";
import FilterPage from "../pages/Filter";
import DetailPage from "../pages/Detail";
import Upload from "../pages/Upload";
import { RouteType } from "../types";
import Chat from "../pages/Chat";
import NoLayout from "@/layouts/NoLayout";
import WelcomePage from "@/pages/Welcome";

const publicRoute: RouteType[] = [
  {
    path: "/",
    component: Home,
  },


  {
    path: "/login",
    component: Login,
    layout: NoLayout,
  },

  {
    path:"/auth/callback",
    component: GoogleCallback,
  },

  {
    path: "/filter",
    component: FilterPage,
  },

  {
    path: "/detail/:projectId",
    component: DetailPage,
  },

  {
    path: "/welcome",
    component: WelcomePage,
    layout: NoLayout,
  },
];

const privateRoute: RouteType[] = [
  {
    path: "/upload",
    component: Upload,
  },

  {
    path: "/profile",
    component: ProfilePage,
  },

  {
    path: "/chat",
    component: Chat,
  }
];

export { privateRoute, publicRoute };
