import React from "react";
import { Route, Routes } from "react-router-dom";
import { publicRoute, privateRoute } from ".";
import MainLayout from "../layouts/MainLayout";
import { RouteType } from "../types";
import NotFound from "../components/Utils/NotFound";
import PrivateRoute from "./PrivateRoute";

const RouteConfig: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoute.map((route: RouteType, index: number) => {
        const Layout = route.layout || MainLayout;
        const Component = route.component;

        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                <Component />
              </Layout>
            }
          />
        );
      })}

      {/* Private Routes */}
      {privateRoute.map((route: RouteType, index: number) => {
        const Layout = route.layout || MainLayout;
        const Component = route.component;

        return (
          <Route
            key={index}
            path={route.path}
            element={
              <PrivateRoute>
                <Layout>
                  <Component />
                </Layout>
              </PrivateRoute>
            }
          />
        );
      })}

      {/* Not Found Route */}
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFound />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default RouteConfig;
