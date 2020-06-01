import React, { useContext, useMemo } from 'react';
import MaterialTable from 'material-table';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { BudgetContext } from '../../../../contexts/BudgetState';
import { CategoriesContext } from '../../../../contexts/CategoriesState';
import { SubcategoriesContext } from '../../../../contexts/SubcategoriesState';
import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';
import { AuthContext } from '../../../../contexts/AuthState';

import DetailPanel from './DetailPanel';

const options = {
  paging: false,
  search: true,
  showTitle: false,
  minBodyHeight: 500,
  maxBodyHeight: 500,
  rowStyle: (_, index) => {
    return index % 2 !== 0 ? { backgroundColor: '#EEE' } : { backgroundColor: 'inherit' }
  }
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

function SubcategoryEditComponent(props) {
  const {  value, onChange, subcategories, editComponentProps } = props;
  const rowData = { ...editComponentProps.rowData }
  let filteredSubcategories = [];

  if (rowData.category_id) {
    filteredSubcategories = subcategories.filter(subcategory => subcategory.category_id === rowData.category_id);
  }

  return (
    <FormControl>
      <Select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      >
        { filteredSubcategories.map(subcategory => <MenuItem key={subcategory.id} value={subcategory.id || ''}>{subcategory.subcategory_name}</MenuItem>) }
      </Select>
    </FormControl>
  );
}

function editable(
  getBudget, 
  getTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction, 
  currentUser, 
  month, 
  year) {
  return {
    onRowAdd: newData => new Promise((resolve, reject) => {
      const newTransaction = addTransaction(newData, currentUser, month, year);
      newTransaction.then((response) => {
        return response.json();
      })
      .then((data) => {
        getTransactions(currentUser.uid, month, year);
        getBudget(currentUser.uid, month, year);
        resolve(data);
      })
      .catch(error => {
        alert('Failed to process transaction');
        reject(error);
      });
    }),
    onRowUpdate: (newData, oldData) => new Promise((resolve,reject) => {
      const updatedTransaction = updateTransaction(oldData, newData, currentUser);
      updatedTransaction.then((response) => {
        return response.json();
      })
      .then((data) => {
        getTransactions(currentUser.uid, month, year);
        getBudget(currentUser.uid, month, year);
        resolve(data);
      })
      .catch(error => {
        alert('Failed to update transaction');
        reject(error);
      });
    }),
    onRowDelete: oldData => new Promise((resolve,reject) => {
      const deletedTransaction= deleteTransaction(oldData);
      deletedTransaction.then((response) => {
        return response.json();
      })
      .then((data) => {
        getTransactions(currentUser.uid, month, year);
        getBudget(currentUser.uid, month, year);
        resolve(data);
      })
      .catch(error => {
        alert('Failed to delete transaction');
        reject(error);
      });
    })
  }
}

function detailPanel(rowData, currentUser, month, year) {
  return (
    <DetailPanel 
      rowData={rowData} 
      currentUser={currentUser}
      month={month}
      year={year}
    />
  );
}

export default function TransactionHistory(props) {
  const { month, year } = props;
  const { currentUser } = useContext(AuthContext);
  const { getBudget } = useContext(BudgetContext);
  const { categories } = useContext(CategoriesContext);
  const { subcategories } = useContext(SubcategoriesContext);
  const { 
    transactionsHistory,
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useContext(TransactionHistoryContext);

  const columns = useMemo(
    () => {
      const categoryLookup = categories.reduce(
        (lookup, category) => ({
          ...lookup,
          [category.id]: category.category_name
        }), { }
      );

      const subcategoryLookup = subcategories.reduce(
        (lookup, subcategory) => ({
          ...lookup,
          [subcategory.id]: subcategory.subcategory_name
        }), { }
      );

      const columnsWithCustomEdit = [
        { 
          title: 'Category', 
          field: 'category_id',
          lookup: categoryLookup,
          editComponent: props => (
            <CategoryEditComponent 
              value={props.value}
              categories={categories}
              editComponentProps={props}
            />
          )
        },
        { 
          title: 'Subcategory', 
          field: 'subcategory_id',
          lookup: subcategoryLookup,
          editComponent: props => (
            <SubcategoryEditComponent 
              value={props.value}
              onChange={props.onChange}
              subcategories={subcategories}
              editComponentProps={props}
            />
          )
        },
        { title: 'Cost', field: 'cost', type: 'numeric' },
        { title: 'Date', field: 'date', type: 'date', defaultSort: 'asc' }
      ];

      return columnsWithCustomEdit;
    },
    [categories, subcategories]
  );

  return (
    <MaterialTable
      data={transactionsHistory}
      columns={columns}
      options={options}
      detailPanel={rowData => detailPanel(rowData, currentUser, month, year)}
      editable={editable(
        getBudget,
        getTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        currentUser,
        month,
        year
      )}
    />
  );
}