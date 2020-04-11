import React, { useMemo } from 'react';
import Container from 'react-bootstrap/container';
import Row from 'react-bootstrap/row';
import Col from 'react-bootstrap/col';

export default function DetailPanel(props) {
  const { rowData, transactions } = props
  const filteredTransactions = useMemo(
    () => {
      return transactions.filter(transaction => 
        (transaction.subcategory_name === rowData.subcategory_name)
      )
    },
    [rowData, transactions]
  );

  return (
    <Container >
      {filteredTransactions.map(transaction => {
          return (
            <Row key={transaction.id} className="pt-2 align-items-center">
              <Col xs={2}>
                <h4>${transaction.cost.toFixed(2)}</h4>
              </Col>
              <Col xs={7}>
                <small>{transaction.description}</small>
              </Col>
              <Col xs={3}>
                <h6 className="text-right">{new Date(transaction.date).toLocaleDateString()}</h6>
              </Col>
            </Row>
          );
      })}
    </Container>
  );
}