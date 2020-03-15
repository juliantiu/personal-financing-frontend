import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MaterialTable from 'material-table';

function renderAmount(rowData) {
  return `$${rowData.amount}`;
}

const columns = [
  { title: 'Category', field: 'category' },
  { title: 'Subcategory', field: 'subcategory' },
  { title: 'Amount', field: 'amount', type: 'numeric', render: renderAmount },
  { title: 'Description', field: 'description'},
  { title: 'Date', field: 'date' }
];

const options = {
  pageSizeOptions: [5, 10, 15],
  search: true,
  showTitle: false
}

export default function TransactionHistory(props) {
  return(
    <Row className="page-section">
      <Col className="page-heading">
        <h1 className="page-heading-title">Transaction History</h1>
        <MaterialTable 
          data={props.monthData}
          columns={columns}
          options={options}
        />
      </Col>
    </Row>
  );
}