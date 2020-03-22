import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';

import { AuthProvider } from './contexts/AuthState';
import ManilaFolders from './components/ManilaFolders';
import Login from './components/Login';

import PrivateRoute from './HOCs/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <PrivateRoute exact path="/" component={ManilaFolders} />
        <Route exact path="/login" component={Login} />
      </Router>
    </AuthProvider>
  );
}

export default App;
