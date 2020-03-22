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

import FakeDataBudgets from '../../FakeDataBudgets.json'

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

function filterBudgetBasedOnMonth(monthIndex) {
  return FakeDataBudgets.filter(
    budget => {
      return new Date(budget.date).getMonth() === monthIndex;
    }
  );
}

const initTransactionsState = [];
const initBudgetsState = [];
const apiCommand = process.env.REACT_APP_API_GETTRANSACTIONS;
const year = 2020;

export default function ManilaFolders() {
  const [monthIndex, setMonthIndex] = useState(0);
  const [transactions, setTransactions] = useState(initTransactionsState);
  const [budgets, setBudgets] = useState(initBudgetsState);
  const { currentUser } = useContext(AuthContext);
  const url = `http://localhost:5000/${apiCommand}?year=${year}&month=${monthIndex+1}&uid=${currentUser.uid}`

  useEffect(
    () => {
      fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
        }
      )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTransactions(data);
      })
      .catch(error => {
        alert(error);
      });
    }, [monthIndex]
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
                <Summary transactions={transactions} monthBudgetData={filterBudgetBasedOnMonth(monthIndex)}/>
                <TransactionHistory transactions={transactions}/>
                <Budgets transactions={transactions} month={monthIndex} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
