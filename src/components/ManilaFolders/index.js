import React, { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import { AuthContext } from "../../contexts/AuthState";

import Header from '../Header';
import Summary from './Summary';
import TransactionHistory from './TransactionHistory';
import Budgets from './Budgets';

import './index.css';

const months = [
  'January', 
  'February', 
  'March', 
  'April', 
  'May', 
  'June', 
  'July', 
  'August', 
  'September', 
  'October', 
  'November',
  'December'
];

function fetchRequest(url, setMethod) {
  fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials:'same-origin',
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    setMethod(data);
  })
  .catch(error => {
    alert(error);
  });
}

const initDataState = []
const getCategoriesURI = process.env.REACT_APP_API_GETCATEGORIES;
const year = 2020;

export default function ManilaFolders() {
  const { currentUser } = useContext(AuthContext);
  const [monthIndex, setMonthIndex] = useState(0);
  const [transactions, setTransactions] = useState(initDataState);
  const [budgets, setBudgets] = useState(initDataState);
  const [categories, setCategories] = useState(initDataState);
  const categoriesUrl = `http://localhost:5000/${getCategoriesURI}?year=${year}&month=${monthIndex}&uid=${currentUser.uid}`;

  useEffect(
    () => {
      fetchRequest(categoriesUrl, setCategories);
    }, [monthIndex, setCategories, categoriesUrl]
  );

  const handleChange = (newMonthIndex) => {
    // onSelect passes in a string version of newMonthIndex
    setMonthIndex(parseInt(newMonthIndex));
  };

  return (
    <>
      <Header />
      <Container fluid>
        <Row>
          <Col>
            <Row>
              <Col>
                <Tabs activeKey={monthIndex} onSelect={handleChange}> { 
                  months.map((tab, index) => {
                    return (
                      <Tab key={index} eventKey={index} title={tab} />
                    );
                  }) 
                }
                </Tabs>
              </Col>
            </Row>
            <Row className="justify-content-center folder">
              <Col className="page" xs={10}>
                {/* <Summary 
                  transactions={transactions} 
                  budgets={budgets}
                /> */}
                <hr />
                <TransactionHistory 
                  month={monthIndex} 
                  year={2020}                  
                  transactions={transactions} 
                  categories={categories} 
                  budgets={budgets}
                  setTransactions={setTransactions}
                  currentUser={currentUser}
                />
                <hr />
                <Budgets 
                  transactions={transactions} 
                  month={monthIndex} 
                  year={2020}
                  setBudgets={setBudgets}
                  categories={categories}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
