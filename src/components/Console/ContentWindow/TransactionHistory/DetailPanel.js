import React, { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { CategoriesContext } from '../../../../contexts/CategoriesState';
import { SubcategoriesContext } from '../../../../contexts/SubcategoriesState';
import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';
import { BudgetContext } from '../../../../contexts/BudgetState';

export default function DetailPanel(props){
  const { currentUser, month, year } = props;
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
    const categoriesList = categories.map(category => category.id);
    const oldData = { id };
    const newData = { subcategory_id, cost, date, description: value };
    const updatedTransaction = updateTransaction(oldData, newData, currentUser);
    updatedTransaction.then(() => {
      getBudget(currentUser.uid, month, year);
      getTransactions(currentUser.uid, month, year);
      getSubcategories(categoriesList);
    }).catch(error => {
      alert('Failed to update transaction', error);
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
        {/* <div className="update-button-container">
          <button onClick={submit} className="update-button"><CheckIcon fontSize="large"/></button>
        </div> */}
      </Grid>
    </Grid>
  );
}