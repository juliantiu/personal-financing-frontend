import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { BudgetContext } from '../../../../contexts/BudgetState';
import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';
import { CategoriesContext } from '../../../../contexts/CategoriesState';

import BudgetBreakdown from './BudgetBreakdown';
import TransactionLimit from './TransactionLimit';
import OverLimit from './OverLimit';

export default function Analytics() {
  const { categories } = useContext(CategoriesContext);
  const { budget } = useContext(BudgetContext);
  const { transactionsHistory } = useContext(TransactionHistoryContext);

  return (
    <Grid container spacing={2}>
      <Grid item lg={6} xs={12}>
        <Paper elevation={2}>
          <TransactionLimit budget={budget} transactionsHistory={transactionsHistory} />
        </Paper>
      </Grid>
      <Grid item lg={6} xs={12}>
        <Paper elevation={2}>
          <BudgetBreakdown budget={budget} categories={categories} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={2}>
          <OverLimit budget={budget} transactionsHistory={transactionsHistory} />
        </Paper>
      </Grid>
    </Grid>
  );
}