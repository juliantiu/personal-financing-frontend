import React, { useState, useContext, useMemo } from 'react';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { CategoriesContext } from '../../../../contexts/CategoriesState';

export default function BudgetModal(props) {
  const { month, year, currentUser } = props
  const { categories, addCategory } = useContext(CategoriesContext);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState(''); // For the text input

  const categoryLookup = useMemo(
    () => {
      return categories.reduce(
        (lookup, category) => {
          lookup.set(category.category_name, 1);
          return lookup;
        },
        new Map()
      );
    },
    [categories]
  );

  const handleChange = (event) => {
    setCategoryName(event.target.value);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setCategoryName('');
    setOpen(false);
  };

  const handleSubmit = () => {
    const cb = () => {
      setCategoryName('');
      setIsLoading(false);
      setOpen(false);
    }
    setIsLoading(true);
    addCategory(currentUser, categoryName, month, year, cb);
  }

  return (
    <div>
      <Tooltip title="Add Budget Category" placement="left">
        <PlaylistAddIcon fontSize="large" onClick={handleClickOpen} />
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">NEW BUDGET CATEGORY</DialogTitle>
        <DialogContent>
          <TextField
            error={categoryLookup.has(categoryName)}
            helperText={categoryLookup.has(categoryName) ? 'Duplicate category name' : ''}
            autoFocus
            margin="dense"
            label="Category name"
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={isLoading || categoryName === '' || categoryLookup.has(categoryName)}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}