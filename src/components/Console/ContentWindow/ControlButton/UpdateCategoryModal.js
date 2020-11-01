import React, { useState, useContext, useMemo } from 'react';
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

import { CategoriesContext } from '../../../../contexts/CategoriesState';

export default function BudgetModal(props) {
  const { currentUser, month, year } = props
  const { categories, updateCategory } = useContext(CategoriesContext);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(''); // For the select input
  const [newCategoryName, setNewCategoryName] = useState(''); // For the text input

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
    setCategoryId('');
    setNewCategoryName('');
    setOpen(false);
  };

  const handleSubmit = () => {
    const cb = () => {
      setIsLoading(false);
      setOpen(false);
      setCategoryId('');
      setNewCategoryName('');
    }
    setIsLoading(true);
    updateCategory(
      currentUser.uid, 
      categoryId, newCategoryName, 
      month, year,
      cb
    );
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
            error={categoryLookup.has(newCategoryName)}
            helperText={categoryLookup.has(newCategoryName) ? 'Duplicate category name' : ''}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit} 
            color="primary" 
            disabled={
              isLoading || 
              newCategoryName === '' ||
              categoryId === '' || 
              categoryLookup.has(newCategoryName)
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}