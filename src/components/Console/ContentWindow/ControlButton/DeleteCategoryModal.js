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

import { CategoriesContext } from '../../../../contexts/CategoriesState';

export default function BudgetModal(props) {
  const { categories, deleteCategory } = useContext(CategoriesContext)
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
    const cb = () => {
      setIsLoading(false);
      setOpen(false);
      // categoryId is reset b/c on the next render, 
      // value of Select component will try to map
      // the old categoryId, which was deleted,
      // and won't find it, causing an error
      setCategoryId('');
    }
    setIsLoading(true);
    deleteCategory(categoryId, cb);
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