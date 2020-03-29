import React, { useEffect, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MaterialTable from 'material-table';

import { AuthContext } from "../../../contexts/AuthState";

import BudgetModal from './BudgetModal';
import DetailPanel from './DetailsPanel';

/************************************************************** GLOBAL VARIABLES */

const columns = [
  { title: 'Subcategory', field: 'subcategory_name' },
  { title: 'Short description', field: 'description' },
  { title: 'Allotment', field: 'allotment', type: 'numeric', render: renderAmount },
];

const options = {
  pageSizeOptions: [5, 10, 15],
  search: false,

}

const newSubcategoryURI = process.env.REACT_APP_API_NEWSUBCATEGORY;
const newSubcategoryUrl = `http://localhost:5000/${newSubcategoryURI}`;
const subcategoriesURI = process.env.REACT_APP_API_GETSUBCATEGORIES;
const subcategoriesUrl = `http://localhost:5000/${subcategoriesURI}`;
const deleteSubcategoryURI = process.env.REACT_APP_API_DELETESUBCATEGORY;
const deleteSubcategoryUrl = `http://localhost:5000/${deleteSubcategoryURI}`;
const updateSubcategoryURI = process.env.REACT_APP_API_UPDATESUBCATEGORY;
const updateSubcategoryUrl = `http://localhost:5000/${updateSubcategoryURI}`

/************************************************************** HELPER FUNCTIONS */

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

function detailPanel(rowData) {
  return <DetailPanel rowData={rowData}/>
}

function renderAmount(rowData) {
  return `$${rowData.allotment}`;
}

function editable(rowData, currentUser, setBudgets, categories) {
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
        resolve(data);
      })
      .catch(error => {
        alert('Failed to delete subcategory');
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
  const { currentUser } = useContext(AuthContext);
  const categoryIds_to_names = new Map();
  for (const category in props.categories) {
    categoryIds_to_names.set(props.categories[category].id, props.categories[category].category_name);
  }

  const category_ids = props.categories.map(elements => elements.id);
  const categories = JSON.stringify(category_ids);
  
  useEffect(
    () => {
      getBudgets(props.setBudgets, categories);
    },
    [props.setBudgets, categories]
   );

  return (
    <Row>
      <Col>
        <Row className="page-section">
          <Col className="page-heading">
            <h1 className="page-heading-title">Budgets</h1>
            {
              props.budgets.map(budgetTable => {
                return (
                  <MaterialTable
                    key={budgetTable.category}
                    title={categoryIds_to_names.get(budgetTable.category)}
                    data={budgetTable.subcategories}
                    columns={columns}
                    options={options}
                    editable={editable(budgetTable, currentUser, props.setBudgets, categories)}
                    detailPanel={detailPanel}
                  />
                );
              }) 
            }
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className="text-center" xs={4}>
            <BudgetModal 
              month={props.month}
              year={props.year}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}