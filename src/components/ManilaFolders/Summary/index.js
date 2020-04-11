import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './index.css';

function getBalance() {
  return 5380.0
}

function calculateCategoriesTotal(budgets) {
  console.log(budgets);
  return budgets.reduce(
    (total, currentValue) => {
      return total += currentValue.subcategories.reduce(
        (acc, subcategory) => (acc + subcategory.allotment),
        0
      );
    }, 
    0)
  ;
}

function calculateSpent(transactions) {
  return transactions.reduce((acc, currentValue) => (acc += parseInt(currentValue.cost)), 0);
}

export default function Summary(props) {
  const { transactions, budgets } = props;

  const balance = getBalance();
  const categoriesTotals = calculateCategoriesTotal(budgets);
  const spent = calculateSpent(transactions);
  const remaining = balance - spent;
  let categoriesTotalColor;
  let remainingColor;

  if (categoriesTotals > balance) {
    categoriesTotalColor = {backgroundColor: '#ab6464'}
  } else if (categoriesTotals <= (balance * .10)) {
    categoriesTotalColor = {backgroundColor: '#ab6464'}
  } else if (categoriesTotals <= (balance * .5)) {
    categoriesTotalColor = {backgroundColor: '#ffba3b'}
  } else if (categoriesTotals <= (balance * .9999)) {
    categoriesTotalColor = {backgroundColor: '#ffff62'}
  } else {
    categoriesTotalColor = {backgroundColor: '#78ab78'}
  }

  if (remaining <= (balance * .10)) {
    remainingColor = {backgroundColor: '#ab6464'}
  } else if (remaining <= (balance * .25)) {
    remainingColor = {backgroundColor: '#ffba3b'}
  } else if (remaining <= (balance * .5)) {
    remainingColor = {backgroundColor: '#ffff62'}
  } else {
    remainingColor = {backgroundColor: '#78ab78'}
  }

  return (
    <Row className="page-section">
      <Col>
        <Row>
          <Col className="page-heading">
            <h1 className="page-heading-title">Summary</h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className='text-center'>
            <div className="bubble">
              <h5>${balance}</h5>
            </div>
            <h4>Balance</h4>
          </Col>
          <Col className='text-center'>
            <div className="bubble" style={categoriesTotalColor}>
              <h5>${categoriesTotals}</h5>
            </div>
            <h4>Categories Total</h4>
          </Col>
          <Col className='text-center'>
            <div className="bubble" style={remainingColor}>
              <h5>${spent}</h5>
            </div>
            <h4>Spent</h4>
          </Col>
          <Col className='text-center'>
            <div className="bubble" style={remainingColor}>
              <h5>${remaining}</h5>
            </div>
            <h4>Remaining</h4>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}