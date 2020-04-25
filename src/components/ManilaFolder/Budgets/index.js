import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MaterialTable from 'material-table';
import BudgetAddModal from './BudgetAddModal';
import BudgetUpdateModal from './BudgetUpdateModal';
import BudgetDeleteModal from './BudgetDeleteModal';
import DetailPanel from './DetailsPanel';

/************************************************************** GLOBAL VARIABLES */

const columns = [
  { title: 'Subcategory', field: 'subcategory_name' },
  { title: 'Short description', field: 'description' },
  { title: 'Allotment', field: 'allotment', type: 'numeric', render: renderAmount },
];

const options = {
  pageSize: 3,
  pageSizeOptions: [3, 5, 10, 15],
  search: false
}

const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_DEV_URL :
  process.env.REACT_APP_API_PROD_URL
const getTransactionsURI = process.env.REACT_APP_API_GETTRANSACTIONS;
const newSubcategoryURI = process.env.REACT_APP_API_NEWSUBCATEGORY;
const newSubcategoryUrl = `${hostname}${newSubcategoryURI}`;
const subcategoriesURI = process.env.REACT_APP_API_GETSUBCATEGORIES;
const subcategoriesUrl = `${hostname}${subcategoriesURI}`;
const deleteSubcategoryURI = process.env.REACT_APP_API_DELETESUBCATEGORY;
const deleteSubcategoryUrl = `${hostname}${deleteSubcategoryURI}`;
const updateSubcategoryURI = process.env.REACT_APP_API_UPDATESUBCATEGORY;
const updateSubcategoryUrl = `${hostname}${updateSubcategoryURI}`

/************************************************************** HELPER FUNCTIONS */

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

function getBudgets(setBudgets, categories) {
  fetch(subcategoriesUrl, {
    method: 'POST', // Using POST because I need array to be in the body, but functions as GET
    mode: 'cors',
    cache: 'no-cache',
    credentials:'same-origin',
    headers: {
      'Content-type': 'Application/json'
    },
    body: JSON.stringify({
      categories
    })
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    setBudgets(data);
  })
  .catch(error => {
    console.log('Failed to fetch subcategories:', error);
    setBudgets([]);
  });
}

function detailPanel(rowData, transactions) {
  return <DetailPanel rowData={rowData} transactions={transactions} />
}

function renderAmount(rowData) {
  return `$${rowData.allotment}`;
}

function editable(rowData, setBudgets, categories, setTransactions, transactionsUrl) {
  return {
    onRowAdd: newData => new Promise((resolve, reject) => {
      fetch((newSubcategoryUrl), {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          category_id: rowData.category,
          subcategory_name: newData.subcategory_name,
          allotment: newData.allotment,
          description: newData.description
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        getBudgets(setBudgets, categories);
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
    }),
    onRowUpdate: (newData, oldData) => new Promise((resolve,reject) => {
      fetch((updateSubcategoryUrl + `/${oldData.id}`), {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          category_id: rowData.category,
          subcategory_name: newData.subcategory_name,
          allotment: newData.allotment,
          description: newData.description
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        getBudgets(setBudgets, categories);
        getTransactions(setTransactions, transactionsUrl);
        resolve(data);
      })
      .catch(error => {
        alert('Failed to update subcategory');
        reject(error);
      });
    }),
    onRowDelete: oldData => new Promise((resolve,reject) => {
      fetch((deleteSubcategoryUrl + `/${oldData.id}`), {
        method: 'delete',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        getBudgets(setBudgets, categories);
        resolve(data);
      })
      .catch(error => {
        alert('Failed to delete subcategory');
        reject(error);
      });
    })
  };
}

/************************************************************************* MAIN */

export default function Budgets(props) {
  const { 
    transactions, 
    setTransactions,
    month, 
    year, 
    setBudgets, 
    categories, 
    budgets, 
    setCategories, 
    currentUser 
  } = props;
  const transactionsUrl = `${hostname}${getTransactionsURI}?year=${year}&month=${month}&uid=${currentUser.uid}`;
  const categoryIds_to_names = new Map();
  for (const category in categories) {
    categoryIds_to_names.set(categories[category].id, categories[category].category_name);
  }

  const category_ids = categories.map(elements => elements.id);
  const stringifiedCategories = JSON.stringify(category_ids);
  const sortedBudgets = budgets.sort(
    (currBudget, nextBudget) => (
      categoryIds_to_names.get(currBudget.category) > categoryIds_to_names.get(nextBudget.category) 
      ? 1 : -1
    )
  );
  
  useEffect(
    () => {
      getBudgets(setBudgets, stringifiedCategories);
    },
    [setBudgets, stringifiedCategories, categories]
   );

  return (
    <Row>
      <Col>
        <Row className="page-section">
          <Col className="page-heading">
            <Row>
              <Col xs={4}>
                <h1 className="page-heading-title">Budgets</h1>
              </Col>
              <Col xs={8}>
                <Row>
                  <Col xs={4} className="text-right">
                    <BudgetAddModal 
                      month={month}
                      year={year}
                      setCategories={setCategories}
                      currentUser={currentUser}
                    />
                  </Col>
                  <Col xs={4} className="text-center">
                    <BudgetUpdateModal 
                      month={month}
                      year={year}
                      setCategories={setCategories}
                      currentUser={currentUser}
                      categories={categories}
                      setTransactions={setTransactions}
                    />
                  </Col>
                  <Col xs={4} className="text-left">
                    <BudgetDeleteModal 
                      month={month}
                      year={year}
                      setCategories={setCategories}
                      categories={categories}
                      setTransactions={setTransactions}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            { sortedBudgets.map(budgetTable => {
              return (
                <React.Fragment key={budgetTable.category}>
                  <MaterialTable
                    title={categoryIds_to_names.get(budgetTable.category)}
                    data={budgetTable.subcategories}
                    columns={columns}
                    options={options}
                    editable={editable(budgetTable, setBudgets, stringifiedCategories, setTransactions, transactionsUrl)}
                    detailPanel={rowData => detailPanel(rowData, transactions)}
                  />
                  <br />
                </React.Fragment>
              );
            })}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}