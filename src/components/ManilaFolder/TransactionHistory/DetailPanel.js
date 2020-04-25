import React, { useState } from 'react';
import Container from 'react-bootstrap/container';
import Row from 'react-bootstrap/row';
import Col from 'react-bootstrap/col';
import Button from 'react-bootstrap/button';
import InputGroup from 'react-bootstrap/inputgroup';
import FormControl from 'react-bootstrap/formcontrol';

const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_DEV_URL :
  process.env.REACT_APP_API_PROD_URL
const updateTransactionURI = process.env.REACT_APP_API_UPDATETRANSACTION;
const updateTransactionUrl = `${hostname}${updateTransactionURI}`;
const getTransactionsURI = process.env.REACT_APP_API_GETTRANSACTIONS;

function getTransactions(getTransactionsUrl, setTransactions) {
  fetch(getTransactionsUrl, {
    method: 'GET', // Using POST because I need array to be in the body, but functions as GET
    mode: 'cors',
    cache: 'no-cache',
    credentials:'same-origin',
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    setTransactions(data);
  })
  .catch(error => {
    console.log('Failed toget transaction history:', error);
    setTransactions([]);
  });
}

export default function DetailPanel(props) {
  const { rowData, setTransactions } = props;
  const { uid, cost, subcategory_id, date, month, year } = rowData;
  const getTransactionsUrl = `${hostname}${getTransactionsURI}?year=${year}&month=${month}&uid=${uid}`;
  const [description, setDescription] = useState(rowData.description);

  const onChange = (val) => {
    setDescription(val)
  };

  const onClick = (e) => {
    e.preventDefault();
    fetch((updateTransactionUrl + `/${rowData.id}`), {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials:'same-origin',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        cost,
        description,
        subcategory_id,
        date,
        month,
        year 
      })
    })
    .then((response) => {
      return response.json();
    })
    .then(() => {
      getTransactions(getTransactionsUrl, setTransactions);
    })
    .catch(error => {
      alert(error);
    });
  }

  return (
    <Container>
      <Row className="py-2">
        <Col>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>
                Description:
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              defaultValue={description}
              onChange={e => onChange(e.target.value)}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={e => onClick(e)}>Update</Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
}