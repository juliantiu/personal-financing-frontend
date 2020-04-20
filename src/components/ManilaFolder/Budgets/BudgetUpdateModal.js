import React, { useState, useContext } from 'react';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { AuthContext } from "../../../contexts/AuthState";

const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_DEV_URL :
  process.env.REACT_APP_API_PROD_URL
const getCategoriesURI = process.env.REACT_APP_API_GETCATEGORIES;
const getTransactionsURI = process.env.REACT_APP_API_GETTRANSACTIONS;
const updateCategoryURI = process.env.REACT_APP_API_UPDATECATEGORY;
const updateCategoryUrl = `${hostname}/${updateCategoryURI}`;

function fetchRequest(url, setMethod) {
  fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials:'same-origin',
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    setMethod(data);
  })
  .catch(error => {
    alert(error);
  });
}

export default function BudgetModal(props) {
  const { month, year, setCategories, categories, setTransactions } = props
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(''); // For the select input
  const [newCategoryName, setNewCategoryName] = useState(''); // For the text input
  const { currentUser } = useContext(AuthContext);
  const getCategoriesUrl = `${hostname}/${getCategoriesURI}?year=${year}&month=${month}&uid=${currentUser.uid}`;
  const transactionsUrl = `${hostname}/${getTransactionsURI}?year=${year}&month=${month}&uid=${currentUser.uid}`;

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
    fetch((updateCategoryUrl + `/${categoryId}`), {
      method: 'put',
      mode: 'cors',
      cache: 'no-cache',
      credentials:'same-origin',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        month,
        year,
        category_name: newCategoryName,
        uid: currentUser.uid
      })
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setOpen(false);
      fetchRequest(getCategoriesUrl, setCategories);
      fetchRequest(transactionsUrl, setTransactions)
    })
    .catch(error => {
      alert(error);
    });
  }

  return (
    <div>
      <Button variant="contained" color="default" onClick={handleClickOpen}>
        UPDATE BUDGET
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">UPDATE BUDGET CATEGORY</DialogTitle>
        <DialogContent>
          <InputLabel>Category name</InputLabel>
          <Select
            value={categoryId}
            onChange={handleSelectChange}
            autoFocus
            fullWidth
          >
            { categories.map(category => (<MenuItem key={category.id} value={category.id}>{category.category_name}</MenuItem>)) }
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
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}