import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';

function generateTransactionLimit(transactionsHistory) {
  const transactionLimit = transactionsHistory.reduce(
    (totalTransactions, transaction) => (
      totalTransactions + transaction.cost
    ), 0
  ); 

  return [['Label', 'Value'], ['Transactions', transactionLimit]];
}

function calculateThreshold(budget) {
  return budget?.reduce(
    (threshold, category) => (
      threshold + category.subcategories.reduce(
        (allotmentTotal, subcategory) => (
          allotmentTotal + subcategory.allotment
        ), 0
      )
    ), 0
  );
}

export default function TransactionLimit(props) {
  const { budget, transactionsHistory } = props;
  const transactionLimitData = useMemo(
    () => generateTransactionLimit(transactionsHistory),
    [transactionsHistory]
  );

  const transactionLimitOptions = useMemo(
    () => {
      const threshold = calculateThreshold(budget);
      const subThreshold = threshold - (threshold * .20);
      const limit = threshold + (threshold * .10);

      if (threshold === 0) return { height: 300 };

      return {
        height: 300,
        redFrom: threshold, 
        redTo: limit,
        yellowFrom: subThreshold, 
        yellowTo: threshold,
        greenFrom: 0,
        greenTo: subThreshold,
        minorTicks: 5,
        min: 0,
        max: limit,
        greenColor: '#206140',
        orangeColor: '#cccc00',
        redColor: '#612021'
      };
    },
    [budget]
  );

  return (
    <div className="chart-container">
      <Chart 
        chartType="Gauge"
        data={transactionLimitData.length > 1 ? transactionLimitData : [['Label', 'Value'], ['Transactions', 0]]}
        options={transactionLimitData.length > 1 ? transactionLimitOptions : { }}
        loader={<div>Loading Transaction Limit...</div>}
      />
    </div>
  );
}