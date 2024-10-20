import React from "react";
import { ApolloProvider } from "@apollo/client";
import graphqlClient from "./apis/graphqlClient";
import { BrowserRouter as Router } from "react-router-dom";
import RouteConfig from "./routes/RouteConfig";
import "../index.css";
import LoadingWrapper from "./components/Home/LoadingWrapper";

const App: React.FC = () => {
  return (
    <ApolloProvider client={graphqlClient}>
      <Router>
        <LoadingWrapper>
          <RouteConfig />
        </LoadingWrapper>
      </Router>
    </ApolloProvider>
  );
};

export default App;
