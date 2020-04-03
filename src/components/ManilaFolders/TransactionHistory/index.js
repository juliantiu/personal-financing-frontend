import React, { useMemo, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MaterialTable from 'material-table';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

/************************************************************** GLOBAL VARIABLES */

const options = {
  pageSizeOptions: [5, 10, 15],
  search: true,
  showTitle: false
}

const initData = '';
const getTransactionsURI = process.env.REACT_APP_API_GETTRANSACTIONS;
const newTransactionURI = process.env.REACT_APP_API_NEWTRANSACTION;
const newTransactionUrl = `http://localhost:5000/${newTransactionURI}`
const updateTransactionURI = process.env.REACT_APP_API_UPDATETRANSACTION;
const updateTransactionURL = `http://localhost:5000/${updateTransactionURI}`
const deleteTransactionURI = process.env.REACT_APP_API_DELETETRANSACTION;
const deleteTransactionUrl = `http://localhost:5000/${deleteTransactionURI}`

/************************************************************** HELPER FUNCTIONS */

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

  const subcategories = budgets.filter(category => category.category === rowData.category_id);

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

function editable(currentUser, setTransactions, transactionsUrl, month, year, selectedSubcategory) {
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
        console.log(error);
        setTransactions([]);
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
        alert('Failed to update transaction');
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
  const transactionsUrl = `http://localhost:5000/${getTransactionsURI}?year=${props.year}&month=${props.month}&uid=${props.currentUser.uid}`;
  const [selectedCategory, setSelectedCategory] = useState(initData);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initData);

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
          lookup: categoryLookup
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
        { title: 'Date', field: 'date', type: 'date' }
      ];

      return [transactionsWithDates, columns]
    },
    [
      transactions, 
      setSelectedCategory, 
      selectedCategory, 
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
          editable={editable(currentUser, setTransactions, transactionsUrl, month, year, selectedSubcategory)}
        />
      </Col>
    </Row>
  );
}