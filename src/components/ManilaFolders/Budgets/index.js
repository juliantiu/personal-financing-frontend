import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MaterialTable from 'material-table';

import FakeDataBudgets from '../../../FakeDataBudgets.json'

function renderAmount(rowData) {
  return `$${rowData.allotted}`;
}

const columns = [
  { title: 'Subcategory', field: 'subcategory' },
  { title: 'Allotted', field: 'allotted', type: 'numeric', render: renderAmount },
];

const options = {
  pageSizeOptions: [5, 10, 15],
  search: false,

}

function filterBudgetsBasedOnMonth(monthIndex) {
  return FakeDataBudgets.filter(
    budgetTable => 
      new Date(budgetTable.date).getMonth() === (monthIndex)
  );
}

function combineSimilarCategories(filteredBudgetTables) {
  let combinedTables = [{
    category: filteredBudgetTables[0]?.category ?? 'N/A',
    subcategories: [
      {
        subcategory: filteredBudgetTables[0]?.subcategory ?? 'N/A',
        allotted: filteredBudgetTables[0]?.allotted ?? 0
      }
    ]
  }];

  for (const budgetSubcategory of filteredBudgetTables) {
    combinedTables.forEach(budgetTable => {
      if(budgetTable.category === budgetSubcategory.category) {
        budgetTable.subcategories.push({
          subcategory: budgetSubcategory.subcategory,
          allotted: budgetSubcategory.allotted
        }); 
      } else {
        combinedTables.push({
          category: budgetSubcategory.category,
          subcategories: [
            {
              subcategory: budgetSubcategory.subcategory,
              allotted: budgetSubcategory.allotted
            }
          ]
        });
      }
    });
  } 

  combinedTables[0].subcategories.shift();

  return combinedTables;
}

export default function Budgets(props) {
  const filteredBudgetTables = filterBudgetsBasedOnMonth(props.month);
  const monthlyBudgetTables = combineSimilarCategories(filteredBudgetTables);

  return (
    <Row className="page-section">
      <Col className="page-heading">
        <h1 className="page-heading-title">Budgets</h1>
        {
          monthlyBudgetTables.map((budgetTable, index) => {
            return (
              <MaterialTable
                key={index}
                title={budgetTable.category}
                data={budgetTable.subcategories}
                columns={columns}
                options={options}
              />
            );
          }) 
        }
      </Col>
    </Row>
  );
}