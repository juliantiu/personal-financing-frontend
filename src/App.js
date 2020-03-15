import React from 'react';
import Container from 'react-bootstrap/Container';

import './App.css';

import Header from './components/Header';
import ManilaFolders from './components/ManilaFolders';

function App() {
  return (
    <>
      <Header />
      <Container fluid>
        <ManilaFolders />
      </Container>
    </>
  );
}

export default App;
