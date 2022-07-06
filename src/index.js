import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css";
import { UserContextProvider } from './context/userContext';
import { QueryClient, QueryClientProvider } from 'react-query';

const client = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <QueryClientProvider client={client}>
        <Router>
          <App />
        </Router>
        </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>
);
