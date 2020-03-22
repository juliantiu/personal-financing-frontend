import React, { useMemo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MaterialTable from 'material-table';

function renderAmount(rowData) {
  return `$${rowData.cost}`;
}

const columns = [
  { title: 'Category', field: 'category_name' },
  { title: 'Subcategory', field: 'subcategory_name' },
  { title: 'Amount', field: 'cost', type: 'numeric', render: renderAmount },
  { title: 'Description', field: 'description'},
  { title: 'Date', field: 'date', type: 'date' }
];

const options = {
  pageSizeOptions: [5, 10, 15],
  search: true,
  showTitle: false
}

export default function TransactionHistory(props) {

  console.log(props.transactions)
  const data = useMemo(
    () => {
      return props.transactions.map(element => {
        return { ...element, date: new Date(element.date) }
      })
    },
    [props.transactions]
  );

  console.log('data:', data);

  return(
    <Row className="page-section">
      <Col className="page-heading">
        <h1 className="page-heading-title">Transaction History</h1>
        <MaterialTable 
          data={data}
          columns={columns}
          options={options}
        />
      </Col>
    </Row>
  );
}