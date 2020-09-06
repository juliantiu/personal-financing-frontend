import React, { useContext, useMemo } from 'react';
import MaterialTable from 'material-table';

import { BudgetContext } from '../../../../contexts/BudgetState';
import { CategoriesContext } from '../../../../contexts/CategoriesState';
import { SubcategoriesContext } from '../../../../contexts/SubcategoriesState';
import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';
import { AuthContext } from '../../../../contexts/AuthState';

import DetailPanel from './DetailPanel';

const columns = [
  { title: 'Subcategory', field: 'subcategory_name' },
  { title: 'Allotment', field: 'allotment', type: 'numeric', defaultSort: 'desc' },
  { title: 'Short Description', field: 'description' }
];

function editable(
  rowData,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getBudget,
  getTransactions,
  getSubcategories,
  currentUser,
  month,
  year,
  categoriesList) {
  return {
    onRowAdd: newData => new Promise((resolve, reject) => {
      const newSubcategory = addSubcategory(rowData, newData, currentUser.uid, month, year);
      newSubcategory.then((response) => {
        return response.json();
      })
      .then((data) => {
        getSubcategories(categoriesList);
        getTransactions(currentUser.uid, month, year);
        getBudget(currentUser.uid, month, year);
        resolve(data);
      })
      .catch(error => {
        alert('Failed to add subcategory');
        reject(error);
      });
    }),
    onRowUpdate: (newData, oldData) => new Promise((resolve,reject) => {
      const updatedSubcategory = updateSubcategory(rowData, newData, oldData);
      updatedSubcategory.then((response) => {
        return response.json();
      })
      .then((data) => {
        getSubcategories(categoriesList);
        getTransactions(currentUser.uid, month, year);
        getBudget(currentUser.uid, month, year);
        resolve(data);
      })
      .catch(error => {
        alert('Failed to update subcategory');
        reject(error);
      });
    }),
    onRowDelete: oldData => new Promise((resolve,reject) => {
      const deletedSubcategory = deleteSubcategory(oldData);
      deletedSubcategory.then((response) => {
        return response.json();
      })
      .then((data) => {
        getSubcategories(categoriesList);
        getTransactions(currentUser.uid, month, year);
        getBudget(currentUser.uid, month, year);
        resolve(data);
      })
      .catch(error => {
        alert('Failed to delete subcategory');
        reject(error);
      });
    })
  }
}

function detailPanel(rowData) {
  return (
    <DetailPanel rowData={rowData}/>
  );
}

export default function Budget(props) {
  const { month, year } = props;
  const { currentUser } = useContext(AuthContext);
  const { budget, getBudget } = useContext(BudgetContext);
  const { categories } = useContext(CategoriesContext);
  const { getSubcategories, addSubcategory, updateSubcategory, deleteSubcategory } = useContext(SubcategoriesContext);
  const { getTransactions, transactionsHistory } = useContext(TransactionHistoryContext);

  const tables = useMemo(
    () => {
      const categoryLookup = categories.reduce(
        (lookup, category) => {
          lookup.set(category.id, category.category_name)
          return lookup;
        },
        new Map()
      );

      const budgetSpendingTotals = transactionsHistory.reduce(
        (lookup, transac) => {
          return lookup.set(transac.subcategory_id,
            (lookup.get(transac.subcategory_id) ?? 0) + transac.cost
          );
        },
        new Map()
      );

      const options = {
        paging: false,
        search: false,
        showTitle: true,
        minBodyHeight: 300,
        maxBodyHeight: 300,
        rowStyle: (rowData, index) => {
          return rowData.allotment < budgetSpendingTotals.get(rowData.id) ?
          { backgroundColor: 'lightcoral' } :
            index % 2 !== 0 ? 
              { backgroundColor: '#EEE' } :
              { backgroundColor: 'inherit' }
        }
      }

      const sortedBudget = budget.sort((a, b) => { 
        const nameA = categoryLookup.get(a.category);
        const nameB = categoryLookup.get(b.category);

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      
        // names must be equal
        return 0;
      });
      
      const categoriesList = categories.map(category => category.id);

      return (
        sortedBudget.map(budgetItem => (
          <MaterialTable
            key={`budget-table-${budgetItem.category}`}
            title={categoryLookup.get(budgetItem.category)}
            data={budgetItem.subcategories}
            columns={columns}
            options={options}
            detailPanel={detailPanel}
            editable={
              editable(
                budgetItem, 
                addSubcategory, 
                updateSubcategory,
                deleteSubcategory,
                getBudget, 
                getTransactions,
                getSubcategories,
                currentUser, 
                month, 
                year,
                categoriesList
              )
            }
          />
        ))
      );
    }, [
      transactionsHistory,
      categories, 
      budget, 
      addSubcategory, 
      updateSubcategory, 
      deleteSubcategory,
      getBudget, 
      getTransactions,
      getSubcategories,
      currentUser, 
      month, 
      year,
    ]
  );

  return (
    <div className="tables-container">
      {tables}
    </div> 
  );
}