import { ApolloProvider } from '@apollo/client';
import graphqlClient from './apis/graphqlClient';
import { BrowserRouter as Router } from 'react-router-dom';
import RouteConfig from './routes/RouteConfig';
import "../index.css";

function App() {
  return (
    <ApolloProvider client={graphqlClient}>
      <Router>
        <RouteConfig/>
      </Router>
    </ApolloProvider>
  );
}

export default App;