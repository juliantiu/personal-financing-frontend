import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';

import { AuthProvider } from './contexts/AuthState';
import Console from './components/Console';
import Access from './components/Access';

import PrivateRoute from './HOCs/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <PrivateRoute exact path="/" component={Console} />
        <Route exact path="/Access" component={Access} />
      </Router>
    </AuthProvider>
  );
}

export default App;
