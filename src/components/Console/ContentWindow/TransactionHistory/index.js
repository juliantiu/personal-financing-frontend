import React, { useContext, useMemo, useState } from 'react';
import MaterialTable from 'material-table';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { CategoriesContext } from '../../../../contexts/CategoriesState';
import { SubcategoriesContext } from '../../../../contexts/SubcategoriesState';
import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';
import { AuthContext } from '../../../../contexts/AuthState';

import DetailPanel from './DetailPanel';

const options = {
  addRowPosition: "first",
  paging: true,
  pageSize: 8,
  draggable: false,
  pageSizeOptions: [8, 16, 32],
  search: true,
  showTitle: false,
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
  addTransaction, 
  updateTransaction, 
  deleteTransaction, 
  currentUser, 
  month, 
  year) {
  return {
    onRowAdd: async (newData) => {
      addTransaction(newData, currentUser, month, year);
    },
    onRowUpdate: async (newData, oldData) => {
      updateTransaction(oldData, newData, currentUser, month, year);
    },
    onRowDelete: async (oldData) => {
      deleteTransaction(oldData);
    }
  }
}

function detailPanel(rowData, currentUser, month, year, setIsLoading) {
  return (
    <DetailPanel 
      rowData={rowData} 
      currentUser={currentUser}
      month={month}
      year={year}
      setIsLoading={setIsLoading}
    />
  );
}

export default function TransactionHistory(props) {
  const [isLoading, setIsLoading] = useState(false);
  const { month, year } = props;
  const { currentUser } = useContext(AuthContext);
  const { categories } = useContext(CategoriesContext);
  const { subcategories } = useContext(SubcategoriesContext);
  const { transactionsHistory, addTransaction, updateTransaction, deleteTransaction } = useContext(TransactionHistoryContext);

  const data = useMemo(
    () => {
      if (transactionsHistory === undefined) return [];
      return transactionsHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    [transactionsHistory]
  );

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
        { title: 'Date', field: 'date', type: 'date' }
      ];

      return columnsWithCustomEdit;
    },
    [categories, subcategories]
  );

  return (
    <div className="tables-container">
      <MaterialTable
        data={data}
        columns={columns}
        options={options}
        isLoading={isLoading}
        detailPanel={rowData => detailPanel(rowData, currentUser, month, year, setIsLoading)}
        editable={editable(
          addTransaction,
          updateTransaction,
          deleteTransaction,
          currentUser,
          month,
          year
        )}
      />
    </div>
  );
}