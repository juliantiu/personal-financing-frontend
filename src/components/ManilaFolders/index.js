import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Summary from './Summary';
import TransactionHistory from './TransactionHistory';
import Budgets from './Budgets';

import FakeDataTransactions from '../../FakeData.json';
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

function filterTransactionBasedOnMonth(monthIndex) {
  return FakeDataTransactions.filter(
    transaction => {
      return new Date(transaction.date).getMonth() === monthIndex;
    }
  );
}

function filterBudgetBasedOnMonth(monthIndex) {
  return FakeDataBudgets.filter(
    budget => {
      return new Date(budget.date).getMonth() === monthIndex;
    }
  );
}

export default function ManilaFolders() {
  const [monthIndex, setMonthIndex] = useState(0);

  const handleChange = (newMonthIndex) => {
    // onSelect passes in a string version of newMonthIndex
    setMonthIndex(parseInt(newMonthIndex));
  };

  return (
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
            <Summary monthTransactionData={filterTransactionBasedOnMonth(monthIndex)} monthBudgetData={filterBudgetBasedOnMonth(monthIndex)}/>
            <TransactionHistory monthData={filterTransactionBasedOnMonth(monthIndex)}/>
            <Budgets monthData={filterTransactionBasedOnMonth(monthIndex)} month={monthIndex} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
