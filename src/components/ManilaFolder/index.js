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

const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_DEV_URL :
  process.env.REACT_APP_API_PROD_URL
const initDataState = [];
const initMonth = new Date(Date.now()).getMonth();
const getCategoriesURI = process.env.REACT_APP_API_GETCATEGORIES;
const currYear = new Date(Date.now()).getFullYear();

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

export default function ManilaFolders() {
  const { currentUser } = useContext(AuthContext);
  const [year, setYear] = useState(currYear);
  const [monthIndex, setMonthIndex] = useState(initMonth);
  const [transactions, setTransactions] = useState(initDataState);
  const [budgets, setBudgets] = useState(initDataState);
  const [categories, setCategories] = useState(initDataState);
  const categoriesUrl = `${hostname}/${getCategoriesURI}?year=${year}&month=${monthIndex}&uid=${currentUser.uid}`;

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
      <Header 
        setYear={setYear}
      />
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
                <Summary 
                  transactions={transactions} 
                  budgets={budgets}
                />
                <hr />
                <TransactionHistory 
                  month={monthIndex} 
                  year={year}                  
                  transactions={transactions} 
                  categories={categories} 
                  budgets={budgets}
                  setTransactions={setTransactions}
                  currentUser={currentUser}
                />
                <hr />
                <Budgets
                  setTransactions={setTransactions} 
                  transactions={transactions} 
                  month={monthIndex} 
                  year={year}
                  budgets={budgets}
                  setBudgets={setBudgets}
                  categories={categories}
                  setCategories={setCategories}
                  currentUser={currentUser}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
