import React, { useState, useContext } from 'react';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { BudgetContext } from '../../../../contexts/BudgetState';
import { CategoriesContext } from '../../../../contexts/CategoriesState';
import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';

export default function CloneBudget(props) {
  const { month, year, currentUser } = props
  const { getBudget, cloneBudget } = useContext(BudgetContext);
  const { getCategories } = useContext(CategoriesContext);
  const { getTransactions } = useContext(TransactionHistoryContext);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const clonedBudget = cloneBudget(currentUser.uid, month, year);
    clonedBudget.then(() => {
      setIsLoading(false);
      // giving time for google database to update before fetching new data
      setTimeout(
        () => {
          setOpen(false);
          getCategories(currentUser.uid, month, year);
          getBudget(currentUser.uid, month, year);
          getTransactions(currentUser.uid, month, year);
        },
        1000
      );
    });
  }

  return (
    <div>
      <Tooltip title="Clone Last Month's Budget" placement="left">
        <LibraryBooksIcon fontSize="large" onClick={handleClickOpen} />
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">CLONE LAST MONTH'S BUDGET</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clone last month's budget?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
            Clone
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}