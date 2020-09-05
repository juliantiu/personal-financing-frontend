import React, { useContext, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Analytics from './Analytics';
import TransactionHistory from './TransactionHistory';
import Budget from './Budget';
import ControlButton from './ControlButton';

import { AuthContext } from '../../../contexts/AuthState';
import { TransactionHistoryContext } from '../../../contexts/TransactionHistoryState';
import { BudgetContext } from '../../../contexts/BudgetState';
import { CategoriesContext } from '../../../contexts/CategoriesState';
import { SubcategoriesContext } from '../../../contexts/SubcategoriesState';

import useStyles from '../../../hooks/useStyles';

export default function ContentWindow(props) {
  const classes = useStyles();
  const { month, year } = props;
  const { currentUser } = useContext(AuthContext);
  const { getBudget, budget, budgetIsLoading, budgetError } = useContext(BudgetContext);
  const { getCategories, categories, categoriesIsLoading, categoriesError } = useContext(CategoriesContext);
  const { getSubcategories, subcategories, subcategoriesIsLoading, subcategoriesError } = useContext(SubcategoriesContext);
  const { getTransactions, transactionsHistory, transactionsHistoryIsLoading, transactionsHistoryError } = useContext(TransactionHistoryContext);

  useEffect(
    () => {
      getBudget(currentUser.uid, month, year);
    },
    [getBudget, currentUser, month, year]
  );

  useEffect(
    () => {
      getCategories(currentUser.uid, month, year);
    },
    [getCategories, currentUser, month, year]
  );

  useEffect(
    () => {
      if (categories === undefined) return;
      const categoriesList = categories.map(category => category.id);
      getSubcategories(categoriesList);
    },
    [getSubcategories, categories]
  );

  useEffect(
    () => {
      getTransactions(currentUser.uid, month, year);
    },
    [getTransactions, currentUser, month, year]
  );

  if (transactionsHistoryError || categoriesError || subcategoriesError || budgetError) {
    return (
      <>
        <div id="top" className={classes.toolbar}/>
        <Grid container className={classes.contentWindowContainer}>
          <Grid item xs={12}>
            <Typography variant="h2" gutterBottom>Error!</Typography>
          </Grid>
        </Grid>
      </>
    );
  }

  if (
    budget === undefined || categories === undefined || subcategories === undefined || transactionsHistory === undefined ||
    budgetIsLoading || categoriesIsLoading || subcategoriesIsLoading || transactionsHistoryIsLoading
  ) {
    return (
      <>
        <div id="top" className={classes.toolbar}/>
        <Grid container className={classes.contentWindowContainer}>
          <Grid item xs={12}>
            <Typography variant="h2" gutterBottom>Loading...</Typography>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <div id="top" className={classes.toolbar}/>
      <Grid container className={classes.contentWindowContainer}>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>Analytics</Typography>
          <Analytics 
            month={month}
            year={year}
          />
          <hr />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>Transactions</Typography>
          <TransactionHistory 
            month={month}
            year={year}
          />
          <hr />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>Budget Tables</Typography>
          <Budget 
            month={month}
            year={year}
          />
        </Grid>
      </Grid>
      <AppBar className={classes.bottomAppBar}>
        <Toolbar>
          <ControlButton 
            position="fixed"
            month={month}
            year={year}
          />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}