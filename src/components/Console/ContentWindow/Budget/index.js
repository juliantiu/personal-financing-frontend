import React, { useContext, useMemo } from 'react';
import MaterialTable from 'material-table';

import { CategoriesContext } from '../../../../contexts/CategoriesState';
import { SubcategoriesContext } from '../../../../contexts/SubcategoriesState';
import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';
import { AuthContext } from '../../../../contexts/AuthState';

import DetailPanel from './DetailPanel';

const materialTableStyle = { marginTop: 10 };

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
  currentUser,
  month,
  year) {
  return {
    onRowAdd: async (newData) => {
      addSubcategory(rowData, newData, currentUser.uid, month, year);
    },
    onRowUpdate: async (newData, oldData) => {
      updateSubcategory(rowData, newData, oldData);
    },
    onRowDelete: async (oldData) => {
      deleteSubcategory(oldData);
    }
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
  const { categories } = useContext(CategoriesContext);
  const { subcategories, addSubcategory, updateSubcategory, deleteSubcategory } = useContext(SubcategoriesContext);
  const { transactionsHistory } = useContext(TransactionHistoryContext);

  const options = useMemo(
    () => {
      const budgetSpendingTotals = transactionsHistory.reduce(
        (lookup, transac) => {
          return lookup.set(transac.subcategory_id,
            (lookup.get(transac.subcategory_id) ?? 0) + transac.cost
          );
        },
        new Map()
      )
      return {
        paging: false,
        search: false,
        showTitle: true,
        rowStyle: (rowData, index) => {
          if (rowData.allotment < budgetSpendingTotals.get(rowData.id)) {
            return { backgroundColor: 'lightcoral' };
          } else if (!budgetSpendingTotals.get(rowData.id)) {
            // when in here, meaning spending for this subcategory is === 0
            return { backgroundColor: 'wheat' };
          } 
          return index % 2
            ? { backgroundColor: '#EEE' }
            : { backgroundColor: 'inherit' }
        }
      }
    },
    [transactionsHistory]
  );

  const categoryLookup = useMemo(
    () => categories.reduce(
      (lookup, category) => {
        lookup.set(category.id, category.category_name)
        return lookup;
      },
      new Map()
    ),
    [categories]
  );

  const tables = useMemo(
    () => {
      const budget = [];
      const budgetItems = {};
      for (const subcategory of subcategories) {
        const { category_id } = subcategory;
        if (budgetItems.hasOwnProperty(category_id)) {
          budgetItems[category_id].push(subcategory);
        } else {
          budgetItems[category_id] = [subcategory];
        }
      }

      for (const category of categories) {
        if (!budgetItems.hasOwnProperty(category.id)) {
          budget.push({ category: category.id, subcategories: [] });
        }
      }

      for (const budgetItem of Object.entries(budgetItems)) {
        const [category, subcategories] = budgetItem;
        budget.push({ category, subcategories });
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
                currentUser, 
                month, 
                year
              )
            }
            style={materialTableStyle}
          />
        ))
      );
    }, [
      categories,
      subcategories,
      addSubcategory,
      categoryLookup,
      options,
      currentUser,
      deleteSubcategory,
      month,
      year,
      updateSubcategory
    ]
  );

  return (
    <div className="tables-container">
      {tables}
    </div> 
  );
}