import React, { useState, useContext } from 'react';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
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
const deleteCategoryURI = process.env.REACT_APP_API_DELETECATEGORY;
const deleteCategoryUrl = `${hostname}${deleteCategoryURI}`;

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
  const [categoryId, setCategoryId] = useState(''); // For the text input
  const { currentUser } = useContext(AuthContext);
  const getCategoriesUrl = `${hostname}${getCategoriesURI}?year=${year}&month=${month}&uid=${currentUser.uid}`;
  const transactionsUrl = `${hostname}${getTransactionsURI}?year=${year}&month=${month}&uid=${currentUser.uid}`;

  const handleChange = (event) => {
    setCategoryId(event.target.value);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    fetch((deleteCategoryUrl + `/${categoryId}`), {
      method: 'delete',
      mode: 'cors',
      cache: 'no-cache',
      credentials:'same-origin',
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
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        DELETE BUDGET
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">DELETE BUDGET CATEGORY</DialogTitle>
        <DialogContent>
          <InputLabel>Category name</InputLabel>
          <Select
            value={categoryId}
            onChange={handleChange}
            fullWidth
          >
            { categories.map(category => (<MenuItem key={category.id} value={category.id}>{category.category_name}</MenuItem>)) }
          </Select>
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