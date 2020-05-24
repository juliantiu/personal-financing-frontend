import React, { useState, useContext } from 'react';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';

import { BudgetContext } from '../../../../contexts/BudgetState';
import { CategoriesContext } from '../../../../contexts/CategoriesState';
import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';

export default function BudgetModal(props) {
  const { currentUser, month, year } = props
  const { categories, updateCategory, getCategories } = useContext(CategoriesContext);
  const { getBudget } = useContext(BudgetContext);
  const { getTransactions } = useContext(TransactionHistoryContext);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(''); // For the select input
  const [newCategoryName, setNewCategoryName] = useState(''); // For the text input

  const handleSelectChange = (event) => {
    setCategoryId(event.target.value);
  }

  const handleNameChange = (event) => {
    setNewCategoryName(event.target.value);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const updatedCategory = updateCategory(
      currentUser.uid, 
      categoryId, newCategoryName, 
      month, year
    );
    updatedCategory.then(() => {
      setIsLoading(false);
      setOpen(false);
      getCategories(currentUser.uid, month, year);
      getBudget(currentUser.uid, month, year);
      getTransactions(currentUser.uid, month, year);
    }).catch(error => {
      alert(error);
    })
  }

  return (
    <div>
      <Tooltip title="Update Budget Category" placement="left">
        <PlaylistAddCheckIcon fontSize="large" onClick={handleClickOpen} />
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">UPDATE BUDGET CATEGORY</DialogTitle>
        <DialogContent>
          <InputLabel>Category name</InputLabel>
          <Select
            value={categoryId}
            onChange={handleSelectChange}
            autoFocus
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
          <TextField
            margin="dense"
            id="name"
            label="New category name"
            type="name"
            onChange={handleNameChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={isLoading || newCategoryName === '' || categoryId === ''}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}