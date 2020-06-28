import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';

const overLimitDesktopOptions = {
  explorer: {
    axis: 'vertical',
    actions: ['dragToZoom', 'rightClickToReset'],
    keepInBounds: true,
    maxZoomIn: 4.0
  },
  chartArea: {
    top: 100,
    bottom: 200,
    left: 100,
    right: 20
  },
  hAxis: {
    slantedText: true,
    slantedTextAngle: 90,
    
  },
  vAxis: {
    format: 'currency'
  },
  legend: 'top',
  height: 800,
  colors: ['#35727B', '#A34730']
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

  const overLimitMobileOptions = useMemo(
    () => {
      return {
        chartArea: {
          top: 50,
          bottom: 50,
          left: 100,
          right: 30
        },
        height: overLimitData.length * 90,
        explorer: {
          axis: 'horizontal',
          actions: ['dragToZoom', 'rightClickToReset'],
          keepInBounds: true,
          maxZoomIn: 4.0
        },
        hAxis: {
          slantedText: false,
          
        },
        vAxis: {
          format: 'currency'
        },
        legend: 'top',
        colors: ['#35727B', '#A34730']
      }
    },
    [overLimitData]
  );

  return (
    <>
      <div className="hidden-mobile">
        <Chart
          chartType="ColumnChart"
          data={overLimitData.length > 1 ? overLimitData : [['Subcategory', 'Allotment', 'Spent'], [0,0,0]]}
          loader={<div>Loading Subcategory Limits...</div>}
          options={overLimitDesktopOptions}
        />
      </div>
      <div className="hidden-desktop">
        <Chart
          chartType="BarChart"
          data={overLimitData.length > 1 ? overLimitData : [['Subcategory', 'Allotment', 'Spent'], [0,0,0]]}
          loader={<div>Loading Subcategory Limits...</div>}
          options={overLimitMobileOptions}
        />
      </div>
    </>
  );
}