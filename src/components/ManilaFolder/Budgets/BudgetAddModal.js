import React, { useState, useContext } from 'react';

import Button from '@material-ui/core/Button';
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
const newCategoryURI = process.env.REACT_APP_API_NEWCATEGORY;
const categoryURL = `${hostname}${newCategoryURI}`;

function getCategories(categoriesUrl, setCategories) {
  fetch(categoriesUrl, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials:'same-origin',
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    setCategories(data);
  })
  .catch(error => {
    alert(error);
  });
}

export default function BudgetModal(props) {
  const { month, year, setCategories } = props
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(''); // For the text input
  const { currentUser } = useContext(AuthContext);
  const categoriesUrl = `${hostname}${getCategoriesURI}?year=${year}&month=${month}&uid=${currentUser.uid}`;

  const handleChange = (event) => {
    setCategoryName(event.target.value);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    fetch(categoryURL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials:'same-origin',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        uid: currentUser.uid,
        category_name: categoryName,
        month: month,
        year: year
      })
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setOpen(false);
      getCategories(categoriesUrl, setCategories);
    })
    .catch(error => {
      alert(error);
    });
  }

  return (
    <div>
      <Button variant="contained" color="default" onClick={handleClickOpen}>
        NEW BUDGET
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">NEW BUDGET CATEGORY</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Category name"
            type="name"
            onChange={handleChange}
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