import React, { useState, useContext } from 'react';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';

import { BudgetContext } from '../../../../contexts/BudgetState';
import { CategoriesContext } from '../../../../contexts/CategoriesState';
import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';

export default function BudgetModal(props) {
  const { month, year, currentUser } = props
  const { categories, getCategories, deleteCategory } = useContext(CategoriesContext)
  const { getBudget } = useContext(BudgetContext)
  const { getTransactions } = useContext(TransactionHistoryContext);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(''); // For the text input
  
  function handleChange(event) {
    setCategoryId(event.target.value);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const deletedCategory = deleteCategory(categoryId);
    deletedCategory.then(() => {
      setIsLoading(false);
      setOpen(false);
      // categoryId is reset b/c on the next render, 
      // value of Select component will try to map
      // the old categoryId, which was deleted,
      // and won't find it, causing an error
      setCategoryId('');
      getCategories(currentUser.uid, month, year);
      getBudget(currentUser.uid, month, year);
      getTransactions(currentUser.uid, month, year);
    })
    .catch(error => {
      setIsLoading(false);
      alert('Failed to delete budget category', error);
    })
  }

  return (
    <div>
      <Tooltip title="Delete Budget Category" placement="left">
        <DeleteSweepIcon fontSize="large" onClick={handleClickOpen}/>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">DELETE BUDGET CATEGORY</DialogTitle>
        <DialogContent>
          <InputLabel>Category name</InputLabel>
          <Select
            value={categoryId}
            onChange={(event) => handleChange(event)}
            fullWidth
          > { 
            categories.map(category => (
              <MenuItem 
                key={category.id} 
                value={category.id}
              >
                {category.category_name}
              </MenuItem>
            )) 
          }
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={isLoading || categoryId === ''}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}