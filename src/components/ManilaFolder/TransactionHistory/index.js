import React, { useMemo, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MaterialTable from 'material-table';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DetailPanel from './DetailPanel';

/************************************************************** GLOBAL VARIABLES */

const options = {
  pageSizeOptions: [5, 10, 15],
  search: true,
  showTitle: false
}

const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_DEV_URL :
  process.env.REACT_APP_API_PROD_URL
const getTransactionsURI = process.env.REACT_APP_API_GETTRANSACTIONS;
const newTransactionURI = process.env.REACT_APP_API_NEWTRANSACTION;
const newTransactionUrl = `${hostname}/${newTransactionURI}`
const updateTransactionURI = process.env.REACT_APP_API_UPDATETRANSACTION;
const updateTransactionURL = `${hostname}/${updateTransactionURI}`
const deleteTransactionURI = process.env.REACT_APP_API_DELETETRANSACTION;
const deleteTransactionUrl = `${hostname}/${deleteTransactionURI}`

/************************************************************** HELPER FUNCTIONS */

function detailPanel(rowData, setTransactions) {
  return <DetailPanel rowData={rowData} setTransactions={setTransactions} />
}

function subcategoryLookup(budgets) {
  const subcategoryIds_to_names = {};
  for (const category of budgets) {
    for (const subcategory of category.subcategories) {
      subcategoryIds_to_names[subcategory.id] = subcategory.subcategory_name;
    }
  }
  
  return subcategoryIds_to_names;
}

function categoryLookup(categories) {
  const categoryIds_to_names = {};

  for (const category of categories) {
    categoryIds_to_names[category.id] = category.category_name;
  }
  
  return categoryIds_to_names;
}

function SubcategoryEditComponent(props) {
  const {  value, onChange, budgets, editComponentProps } = props;
  const rowData = { ...editComponentProps.rowData }
  let subcategories = budgets;

  if (rowData.category_id) {
    subcategories = budgets.filter(category => category.category === rowData.category_id);
  }

  return (
    <FormControl>
      <Select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      >
        { subcategories[0].subcategories.map(subcategory => <MenuItem key={subcategory.id} value={subcategory.id || ''}>{subcategory.subcategory_name}</MenuItem>) }
      </Select>
    </FormControl>
  );
}

function CategoryEditComponent(props) {
  const { value, categories, editComponentProps } = props;
  const rowData = { ...editComponentProps.rowData }

  const customOnChange = (e) => {
    rowData.category_id = e.target.value;
    editComponentProps.onRowDataChange(rowData);
  }

  return (
    <FormControl>
      <Select
        value={value || ''}
        onChange={e => customOnChange(e)}
      >
        { categories.map(category => <MenuItem key={category.id} value={category.id || ''}>{category.category_name}</MenuItem>) }
      </Select>
    </FormControl>
  );
}

function renderAmount(rowData) {
  return rowData?.cost ? `$${rowData.cost}` : '$0';
}

function getTransactions(setTransactions, transactionsUrl) {
  fetch(transactionsUrl, {
    method: 'GET', 
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

function editable(currentUser, setTransactions, transactionsUrl, month, year, transactions) {
  return {
    onRowAdd: newData => new Promise((resolve, reject) => {
      fetch(newTransactionUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          cost: newData.cost,
          subcategory_id: newData.subcategory_id, //selectedSubcategory,
          date: newData.date,
          month,
          year
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        getTransactions(setTransactions, transactionsUrl);
        resolve(data);
      })
      .catch(error => {
        alert('Failed to create transaction. Make sure all fields are filled!');
        setTransactions(transactions);
        reject(error);
      });
    }),
    onRowUpdate: (newData, oldData) => new Promise((resolve,reject) => {
      fetch((updateTransactionURL + `/${oldData.id}`), {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          cost: newData.cost,
          subcategory_id: newData.subcategory_id,
          date: newData.date,
          month,
          year
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        getTransactions(setTransactions, transactionsUrl);
        resolve(data);
      })
      .catch(error => {
        alert('Failed to update transaction. Make sure all fields are filled!');
        reject(error);
      });
    }),
    onRowDelete: oldData => new Promise((resolve,reject) => {
      fetch((deleteTransactionUrl + `/${oldData.id}`), {
        method: 'delete',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        getTransactions(setTransactions, transactionsUrl);
        resolve(data);
      })
      .catch(error => {
        alert('Failed to delete transaction');
        reject(error);
      });
    })
  };
}

/************************************************************************* MAIN */

export default function TransactionHistory(props) {
  const { month, year, transactions, categories, budgets, setTransactions, currentUser } = props;
  const transactionsUrl = `${hostname}/${getTransactionsURI}?year=${year}&month=${month}&uid=${currentUser.uid}`;

  useEffect(
    () => {
      getTransactions(setTransactions, transactionsUrl)
    },
    [setTransactions, transactionsUrl]
  );

  const [data, columns] = useMemo(
    () => {
      const transactionsWithDates = transactions.map(element => {
        return { ...element, date: new Date(element.date) }
      })

      const columns = [
        { title: 'Category', field: 'category_id', 
          editComponent: props => (
            <CategoryEditComponent 
              value={props.value}
              categories={categories}
              editComponentProps={props}
            />
          ),
          lookup: categoryLookup(categories)
        },
        { title: 'Subcategory', field: 'subcategory_id', 
          editComponent: props => (
            <SubcategoryEditComponent 
              value={props.value}
              onChange={props.onChange}
              budgets={budgets}
              editComponentProps={props}
            />
          ),
          lookup: subcategoryLookup(budgets),
        },
        { title: 'Amount', field: 'cost', type: 'numeric', render: renderAmount },
        { title: 'Date', field: 'date', type: 'date', defaultSort: 'asc'}
      ];

      return [transactionsWithDates, columns]
    },
    [
      transactions, 
      budgets, 
      categories
    ]
  );

  return(
    <Row className="page-section">
      <Col className="page-heading">
        <h1 className="page-heading-title">Transaction History</h1>
        <MaterialTable 
          data={data}
          columns={columns}
          options={options}
          detailPanel={rowData => detailPanel(rowData, setTransactions)}
          editable={editable(currentUser, setTransactions, transactionsUrl, month, year, transactions)}
        />
      </Col>
    </Row>
  );
}