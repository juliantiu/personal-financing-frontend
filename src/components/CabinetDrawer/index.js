import React, { useState, useEffect } from 'react';
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

const yearList = [
  2020,
  2021,
  2022,
  2023,
  2024,
  2025,
  2026,
  2027,
  2028,
  2029,
  2030
];

function logout() {
  app.auth().signOut()
}

export default function CabinetDrawer(props) {
  const { setYear } = props;
  const [drawerState, setDrawerState] = useState({
    top: false,
  });

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerState({ ...drawerState, [side]: open });
  };

  const handlehandleChangeYear = (year) => {
    setYear(year);
  }

  const fullList = side => (
    <Container fluid
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
      className="drawer-container"
    >
      <Row className="folder-container">
        <Col xs={12}>
          <div className="drawer-shoot">
            {yearList.map(
              year => (
                <Row key={`folder-year-${year}`}>
                  <Col xs={12}>
                    <button 
                      className="year" 
                      value={year} 
                      onClick={e => handlehandleChangeYear(parseInt(e.target.value))}
                    >
                      <div className="tab">
                        {year}
                      </div>
                    </button> 
                  </Col>
                </Row>
              )
            )}
          </div>
        </Col>
      </Row>
      <Row className="drawer-extras">
        <Col xs={5} className="text-center">
          <Button onClick={logout}>logout</Button>
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