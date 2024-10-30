import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RouteConfig from "./routes/RouteConfig";
import "../index.css";
import LoadingWrapper from "./components/Home/LoadingWrapper";

const App: React.FC = () => {
  return (
    <Router>
      <LoadingWrapper>
        <RouteConfig />
      </LoadingWrapper>
    </Router>
  );
};

export default App;
