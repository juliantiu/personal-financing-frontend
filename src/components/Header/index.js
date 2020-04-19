import React, { useState } from 'react';
import app from '../../firebase';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import './index.css';
import logo from '../../assets/img/handle.png';

function logout() {
  app.auth().signOut()
}

export default function CabinetDrawer() {
  const [drawerState, setDrawerState] = useState({
    top: false,
  });

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerState({ ...drawerState, [side]: open });
  };

  const fullList = side => (
    <Container fluid
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <Row>
        <Col xs={12}>
          <button onClick={logout}>logout</button>
        </Col>
      </Row>
    </Container>
  );

  return (

    <AppBar position="static">
      <Toolbar>
        <h1 className="title">My Finance App</h1>
        <Button style={{marginLeft: 'auto'}} onClick={toggleDrawer('top', true)}><img src={logo} alt="handle bar"/></Button>
        <Drawer anchor="top" open={drawerState.top} onClose={toggleDrawer('top', false)}>
        {fullList('top')}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}