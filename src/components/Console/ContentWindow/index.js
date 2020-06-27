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

const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_DEV_URL :
  process.env.REACT_APP_API_PROD_URL;

const getBudgetURI = process.env.REACT_APP_API_GETBUDGET;
const getCategoriesURI = process.env.REACT_APP_API_GETCATEGORIES;
const getSubcategoriesURI = process.env.REACT_APP_API_GETSUBCATEGORIES;
const getTransactionsURI = process.env.REACT_APP_API_GETTRANSACTIONS;

export default function ContentWindow(props) {
  const classes = useStyles();
  const { month, year } = props;
  const { currentUser } = useContext(AuthContext);
  const { setBudget, budget } = useContext(BudgetContext);
  const { categories, setCategories } = useContext(CategoriesContext);
  const { setSubcategories, subcategories } = useContext(SubcategoriesContext);
  const { setTransactionsHistory, transactionsHistory } = useContext(TransactionHistoryContext);

  useEffect(
    () => {
      fetch(`${hostname}/${getBudgetURI}/?year=${year}&month=${month}&uid=${currentUser.uid}`, {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
      }).then(resp => { 
        return resp.json(); 
      }).then(data => {
        setBudget(data);
      }).catch(error => {
        alert(error);
      });
    },
    [setBudget, currentUser, month, year]
  );

  useEffect(
    () => {
      fetch(`${hostname}/${getCategoriesURI}/?year=${year}&month=${month}&uid=${currentUser.uid}`, {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
      }).then(resp => { 
        return resp.json(); 
      }).then(data => {
        setCategories(data);
      }).catch(error => {
        alert(error);
      });
    },
    [setCategories, currentUser, month, year]
  );

  useEffect(
    () => {
      fetch(`${hostname}/${getCategoriesURI}/?year=${year}&month=${month}&uid=${currentUser.uid}`, {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
      }).then(resp => { 
        return resp.json(); 
      }).then(data => {
        setCategories(data);
      }).catch(error => {
        alert(error);
      });
    },
    [setCategories, currentUser, month, year]
  );

  useEffect(
    () => {
      if (categories === undefined) return;
      const categoriesList = categories.map(category => category.id);
      fetch(`${hostname}/${getSubcategoriesURI}`, {
        method: 'POST', 
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          categories: categoriesList
        })
      }).then(resp => { 
        return resp.json(); 
      }).then(data => {
        setSubcategories(data);
      }).catch(error => {
        alert(error);
      });
    },
    [categories, setSubcategories]
  );

  useEffect(
    () => {
      fetch(`${hostname}/${getTransactionsURI}/?year=${year}&month=${month}&uid=${currentUser.uid}`, {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
      }).then(resp => { 
        return resp.json(); 
      }).then(data => {
        setTransactionsHistory(data);
      }).catch(error => {
        alert(error);
      });
    },
    [setTransactionsHistory, currentUser, month, year]
  );

  if (budget === undefined || categories === undefined || subcategories === undefined || transactionsHistory === undefined) {
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