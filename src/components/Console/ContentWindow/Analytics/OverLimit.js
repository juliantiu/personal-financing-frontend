import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';

const overLimitOptions = {
  legend: 'top',
  colors: ['#80acaa', '#6e2f3b']
}

function generateUniqueSubcategories(transactionsHistory) {
  return new Set(transactionsHistory.map(transaction => transaction.subcategory_id));
}

function generateSubcategoriesLookupTable(budget) {
  const subcategoriesLookupTable = new Map();

  for (const category of budget) {
    for (const subcategory of category.subcategories) {
      subcategoriesLookupTable.set(subcategory.id, subcategory.subcategory_name);
    }
  }

  return subcategoriesLookupTable;
}

function generateOverLimits(budget, transactionsHistory) {
  const subcategoriesLookupTable = generateSubcategoriesLookupTable(budget);
  // unique subcategories within transaction, not budget
  const uniqueSubcategories = generateUniqueSubcategories(transactionsHistory);
  const budgetSubcategoriesLookup = new Map();
  const transacSubcategoriesLookup = new Map();

  for (const category of budget) {
    for (const subcategory of category.subcategories) {
      budgetSubcategoriesLookup.set(subcategory.subcategory_name, subcategory.allotment);
      transacSubcategoriesLookup.set(subcategory.subcategory_name, 0);
    }
  }

  for (const subcategory of uniqueSubcategories) {
    const filteredTransactions = transactionsHistory.filter(
      transaction => transaction.subcategory_id === subcategory
    );

    let spent = 0;
    for (const transaction of filteredTransactions) {
      spent += transaction.cost
    }
    transacSubcategoriesLookup.set(subcategoriesLookupTable.get(subcategory), spent);
  }

  const overLimit = [['Subcategory', 'Allotment', 'Spent']];

  for (const [key, value] of budgetSubcategoriesLookup) {
    overLimit.push([key, value, transacSubcategoriesLookup.get(key)])
  }

  return overLimit;
}

export default function OverLimit(props) {
  const { budget, transactionsHistory } = props;

  const overLimitData = useMemo(
    () => generateOverLimits(budget, transactionsHistory),
    [budget, transactionsHistory]
  );

  return (
    <Chart
      chartType="ColumnChart"
      data={overLimitData.length > 1 ? overLimitData : [['Subcategory', 'Allotment', 'Spent'], [0,0,0]]}
      loader={<div>Loading Subcategory Limits...</div>}
      options={overLimitOptions}
    />
  );
}