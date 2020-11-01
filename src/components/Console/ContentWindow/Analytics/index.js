import React, { useContext, useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { SubcategoriesContext } from '../../../../contexts/SubcategoriesState';
import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';
import { CategoriesContext } from '../../../../contexts/CategoriesState';

import BudgetBreakdown from './BudgetBreakdown';
import TransactionLimit from './TransactionLimit';
import OverLimit from './OverLimit';

export default function Analytics() {
  const { categories } = useContext(CategoriesContext);
  const { subcategories } = useContext(SubcategoriesContext);
  const { transactionsHistory } = useContext(TransactionHistoryContext);

  const budget = useMemo(
    () => {
      const budgetList = [];
      const budgetItems = {};
      for (const subcategory of subcategories) {
        const { category_id } = subcategory;
        if (budgetItems.hasOwnProperty(category_id)) {
          budgetItems[category_id].push(subcategory);
        } else {
          budgetItems[category_id] = [subcategory];
        }
      }

      for (const category of categories) {
        if (!budgetItems.hasOwnProperty(category.id)) {
          budgetList.push({ category: category.id, subcategories: [] });
        }
      }

      for (const budgetItem of Object.entries(budgetItems)) {
        const [category, subcategories] = budgetItem;
        budgetList.push({ category, subcategories });
      }

      return budgetList;
    },
    [categories, subcategories]
  );

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