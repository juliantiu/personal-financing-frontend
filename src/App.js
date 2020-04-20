import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';

import { AuthProvider } from './contexts/AuthState';
import ManilaFolder from './components/ManilaFolder';
import Login from './components/Login';

import PrivateRoute from './HOCs/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <PrivateRoute exact path="/" component={ManilaFolder} />
        <Route exact path="/login" component={Login} />
      </Router>
    </AuthProvider>
  );
}

export default App;
