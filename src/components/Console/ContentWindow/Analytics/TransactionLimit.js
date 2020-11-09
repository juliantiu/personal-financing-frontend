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

  const [threshold, subSubThreshold, subThreshold] = useMemo(
    () => {
      const th = calculateThreshold(budget);
      const ssth = th * .75;
      const sth = th * .90;

      return [th, ssth, sth]
    },
    [budget]
  );

  const transactionLimitOptions = useMemo(
    () => {
      if (threshold === 0) return { height: 300 };

      return {
        height: 300,
        redFrom: subThreshold, 
        redTo: threshold,
        yellowFrom: subSubThreshold, 
        yellowTo: subThreshold,
        greenFrom: 0,
        greenTo: subSubThreshold,
        minorTicks: 5,
        min: 0,
        max: threshold.toFixed(2),
        greenColor: '#6E8363',
        orangeColor: '#CE9960',
        redColor: '#A34730',
        chartArea: { top: 0, right: 0, bottom: 30, left: 0 }
      };
    },
    [threshold, subThreshold, subSubThreshold]
  );

  return (
    <div className="chart-container">
      <Chart 
        chartType="Gauge"
        data={transactionLimitData.length > 1 ? transactionLimitData : [['Label', 'Value'], ['Transactions', 0]]}
        options={transactionLimitData.length > 1 ? transactionLimitOptions : { }}
        loader={<div>Loading Transaction Limit...</div>}
      />
      <div className="transaction-limit-flip-side">
        {/* transactionLimitData is structured as [['Label', 'Value'], ['Transactions', transactionLimit]].
            Therefore to get the value, transactionLimitData[1][1]
        */}
        <h3>Spent: {transactionLimitData[1][1].toFixed(2)}</h3>
        <h4>Green up to: {subSubThreshold.toFixed(2)}</h4>
        <h4>Orange up to: {subThreshold.toFixed(2)}</h4>
        <h4>Red up to: {threshold.toFixed(2)}</h4>
      </div>
    </div>
  );
}