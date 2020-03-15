import React, { createContext } from 'react';

// initial state of the transaction history
const initialTransactionHistoryState = {
  transactionHistory: [
    {
      category: 'Food',
      subcategory: 'Grocery',
      amount: 32.11,
      description: '',
      Date: new Date("2020-3-1"),
    },
    {
      category: 'Food',
      subcategory: 'Restaurant',
      amount: 11.53,
      description: '',
      Date: new Date("2020-3-1"),
    },
    {
      category: 'Transportation',
      subcategory: 'Gas',
      amount: 11.27,
      description: '',
      Date: new Date("2020-3-2"),
    }
  ]
};

// creating the context
export const TransactionHistoryContext = createContext(initialTransactionHistoryState);

// provider component
export const TransactionHistoryProvider = ({ children }) => {
  return (
    <TransactionHistoryContext.Provider value={
      {
        transactionHistory
      }
    }>
      {children}
    </TransactionHistoryContext.Provider>
  );
}
