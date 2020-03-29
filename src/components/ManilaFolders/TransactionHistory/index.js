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

/************************************************************** HELPER FUNCTIONS */

function categoryLookup(categories) {
  const categoryIds_to_names = {};
  for (const category in categories) {
    categoryIds_to_names[categories[category].id] = categories[category].category_name;
  }

  return categoryIds_to_names;
}

function subcategoryLookup(budgets) {
  return {
    OOpQ0YSKBPsU1KeugFKJ: "hello World",
    PDwSqAd3x0NngoLOqkZL: "hello World2",
    ewfL6PtdkOkAYaUIfnbB: "hello World3",
    hHH6fZq2eEyoZsfgqajB: "hello World4",
    o70QNARkbkPkeSquuykN: "hello World5"
  };
}

function editComponentCategory(categories, setSelectedCategory, selectedCategory) {
  return (
    <FormControl>
      <Select
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
      >
        { categories.map(category => <MenuItem key={category.id} value={category.id}>{category.category_name}</MenuItem>) }
      </Select>
    </FormControl>
  );
}

function editComponentSubcategory(budgets, selectedCategory, selectedSubcategory, setSelectedSubcategory) {
  let subcategories = [];
  for (const budget of budgets) {
    if (budget.category === selectedCategory) {
      subcategories = budget.subcategories;
    }
  }

  return (
    <FormControl>
      <Select
        value={selectedSubcategory}
        onChange={e => setSelectedSubcategory(e.target.value)}
      >
        { subcategories.map(subcategory => <MenuItem key={subcategory.id} value={subcategory.id}>{subcategory.subcategory_name || ''}</MenuItem>) }
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
    console.log('Failed to fetch subcategories:', error);
    setTransactions([]);
  });
}

function editable(currentUser, setTransactions, transactionsUrl) {
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
          subcategory_id: newData.subcategory_id
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
    // onRowUpdate: (newData, oldData) => new Promise((resolve,reject) => {
    //   fetch((updateSubcategoryUrl + `/${oldData.id}`), {
    //     method: 'PUT',
    //     mode: 'cors',
    //     cache: 'no-cache',
    //     credentials:'same-origin',
    //     headers: {
    //       'Content-type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       category_id: rowData.category,
    //       subcategory_name: newData.subcategory_name,
    //       allotment: newData.allotment
    //     })
    //   })
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     getBudgets(setBudgets, categories);
    //     resolve(data);
    //   })
    //   .catch(error => {
    //     alert('Failed to delete subcategory');
    //     reject(error);
    //   });
    // }),
    // onRowDelete: oldData => new Promise((resolve,reject) => {
    //   fetch((deleteSubcategoryUrl + `/${oldData.id}`), {
    //     method: 'delete',
    //     mode: 'cors',
    //     cache: 'no-cache',
    //     credentials:'same-origin',
    //   })
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     getBudgets(setBudgets, categories);
    //     resolve(data);
    //   })
    //   .catch(error => {
    //     alert('Failed to delete subcategory');
    //     reject(error);
    //   });
    // })
  };
}

/************************************************************************* MAIN */

export default function TransactionHistory(props) {
  const transactionsUrl = `http://localhost:5000/${getTransactionsURI}?year=${props.year}&month=${props.monthIndex}&uid=${props.currentUser.uid}`;
  const [selectedCategory, setSelectedCategory] = useState(initData);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initData);

  useEffect(
    () => {
      getTransactions(props.setTransactions, transactionsUrl)
    },
    [props.setTransactions, transactionsUrl]
  );

  const [data, columns] = useMemo(
    () => {
      const transactionsWithDates = props.transactions.map(element => {
        return { ...element, date: new Date(element.date) }
      })

      const columns = [
        { title: 'Category', field: 'category_name', 
          lookup: categoryLookup(props.categories, setSelectedCategory), 
          editComponent: () => editComponentCategory(props.categories, setSelectedCategory, selectedCategory)
        },
        { title: 'Subcategory', field: 'subcategory_name', 
          lookup: subcategoryLookup(props.budgets),
          editComponent: () => editComponentSubcategory(props.budgets, selectedCategory, selectedSubcategory, setSelectedSubcategory)
        },
        { title: 'Amount', field: 'cost', type: 'numeric', render: renderAmount },
        { title: 'Description', field: 'description'},
        { title: 'Date', field: 'date', type: 'date', editable: 'never' }
      ];

      return [transactionsWithDates, columns]
    },
    [
      props.transactions, setSelectedCategory, selectedCategory, 
      props.budgets, props.categories, selectedSubcategory, 
      setSelectedSubcategory
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
          editable={editable(props.currentUser, props.setTransactions, transactionsUrl)}
        />
      </Col>
    </Row>
  );
}