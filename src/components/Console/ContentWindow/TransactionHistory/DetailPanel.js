import React, { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { CategoriesContext } from '../../../../contexts/CategoriesState';
import { SubcategoriesContext } from '../../../../contexts/SubcategoriesState';
import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';
import { BudgetContext } from '../../../../contexts/BudgetState';

export default function DetailPanel(props){
  const { currentUser, month, year, setIsLoading } = props;
  const { description, id, subcategory_id, cost, date } = props.rowData;
  const { getBudget } = useContext(BudgetContext);
  const { getTransactions, updateTransaction } = useContext(TransactionHistoryContext);
  const { categories } = useContext(CategoriesContext);
  const { getSubcategories } = useContext(SubcategoriesContext);
  const [value, setValue] = useState('Controlled');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const submit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const categoriesList = categories.map(category => category.id);
    const oldData = { id };
    const newData = { subcategory_id, cost, date, description: value };
    const updatedTransaction = updateTransaction(oldData, newData, currentUser, month, year);
    updatedTransaction.then(() => {
      getBudget(currentUser.uid, month, year);
      getTransactions(currentUser.uid, month, year);
      // getSubcategories(categoriesList);
      setIsLoading(false);
    }).catch(error => {
      alert('Failed to update transaction', error);
      setIsLoading(false);
    });
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <form onSubmit={event => submit(event)}>
          <TextField
            id="outlined-multiline-static"
            label="Description - hit enter when you're finished updating"
            defaultValue={description}
            variant="outlined"
            onChange={handleChange}
            fullWidth
          />
        </form> 
      </Grid>
    </Grid>
  );
}