import React, { createContext, useState, useCallback } from 'react';
// import { AuthContext } from './AuthState';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_DEV_URL :
  process.env.REACT_APP_API_PROD_URL
const newTransactionURI = process.env.REACT_APP_API_NEWTRANSACTION
const getTransactionsURI = process.env.REACT_APP_API_GETTRANSACTIONS;
const updateTransactionURI = process.env.REACT_APP_API_UPDATETRANSACTION;
const deleteTransactionURI = process.env.REACT_APP_API_DELETETRANSACTION;

// static URL's
const newTransactionURL = `${hostname}/${newTransactionURI}`
const updateTransactionURL = `${hostname}/${updateTransactionURI}`
const deleteTransactionURL = `${hostname}/${deleteTransactionURI}`

// Did this to try out the javascript async await for the first time
// async function getInitTransactions(currentUser) {
//   try {
//     const initMonth = new Date(Date.now()).getMonth();
//     const initYear = new Date(Date.now()).getFullYear();
//     const response = await fetch(`${hostname}/${getTransactionsURI}/?year=${initYear}&month=${initMonth}&uid=${currentUser.uid}`, {
//       method: 'GET', 
//       mode: 'cors',
//       cache: 'no-cache',
//       credentials:'same-origin',
//     });

//     const processedData = await response.json();
//     return processedData;

//   } catch (error) {
//     console.log('Failed to get transaction history:', error);
//   }
// }

// initial state of the transaction history
// const initialTransactionHistoryState = [];

// creating the context, value inside param used to be initialTransactionHistoryState
export const TransactionHistoryContext = createContext(undefined);

// provider component
export const TransactionHistoryProvider = ({ children }) => {
  // Howcome this { currentUser } worked without the provider?
  // Is the AuthProvider actually in scope becuase the usage of this
  // is within the <ContentWindow /> component?
  // const { currentUser } = useContext(AuthContext);
  const [transactionsHistory, setTransactionsHistory] = useState(undefined);
  const [transactionsHistoryIsLoading, setTransactionsHistoryIsLoading] = useState(false);
  const [transactionsHistoryError, setTransactionsHistoryError] = useState(false);

    // START actions
    const getTransactions = useCallback(
      (uid, month, year) => {
        setTransactionsHistoryIsLoading(true);
        fetch(`${hostname}/${getTransactionsURI}/?year=${year}&month=${month}&uid=${uid}`, {
          method: 'GET', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setTransactionsHistory(data);
          setTransactionsHistoryIsLoading(false);
        })
        .catch(error => {
          console.warn('Failed to get transaction history:', error);
          setTransactionsHistoryIsLoading(false);
          setTransactionsHistoryError(true);
        });
      },
      [setTransactionsHistory, setTransactionsHistoryIsLoading, setTransactionsHistoryError]
    );

    const addTransaction = useCallback(
        (newData, currentUser, month, year) => {
        return fetch(newTransactionURL, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            uid: currentUser.uid,
            cost: newData.cost,
            subcategory_id: newData.subcategory_id,
            date: newData.date,
            month,
            year
          })
        })
        .then(response => response.json())
        .then(data => setTransactionsHistory(prev => {
          const prevCopy = [...prev];
          prevCopy.push({
            id: data.id,
            uid: currentUser.uid,
            cost: +newData?.cost ?? newData.cost,
            category_id: newData.category_id,
            subcategory_id: newData.subcategory_id,
            date: newData.date,
            month,
            year
          });
          return prevCopy;
        }))
        .catch(() => alert('Failed to add new transaction'))
      },
      [setTransactionsHistory]
    );

    const updateTransaction = useCallback(
      (oldData, newData, currentUser, month, year, callback) => {
        fetch((`${updateTransactionURL}/${oldData.id}`), {
          method: 'PUT',
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            uid: currentUser.uid,
            cost: +newData?.cost ?? newData.cost,
            subcategory_id: newData.subcategory_id,
            description: newData.description,
            date: newData.date,
            month,
            year
          })
        })
        .then(() => {
          if (callback) {
            callback();
          }
          setTransactionsHistory(
            prev => {
              const prevCopy = [...prev];
              const indexOfTransaction = prevCopy.findIndex(transac => transac.id === oldData.id);
              const updatedTransaction = {
                id: oldData.id,
                uid: currentUser.uid,
                cost: newData.cost,
                category_id: newData.category_id ?? oldData.category_id,
                subcategory_id: newData.subcategory_id,
                description: newData.description,
                date: newData.date,
                month,
                year
              }
              prevCopy[indexOfTransaction] = updatedTransaction;
              return prevCopy;
            }
          );
        })
        .catch(() => alert('Failed to update transaction details'))
      },
      [setTransactionsHistory]
    );

    const deleteTransaction = useCallback(
      (oldData) => {
        fetch((deleteTransactionURL + `/${oldData.id}`), {
          method: 'DELETE',
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
        })
        .then(() => {
          setTransactionsHistory(prev => prev.filter(transac => transac.id !== oldData.id));
        })
        .catch(_ => alert('Failed to delete transaction'))
      },
      [setTransactionsHistory]
    );
    // END actions

  return (
    <TransactionHistoryContext.Provider value={
      {
        transactionsHistoryIsLoading,
        transactionsHistoryError,
        transactionsHistory,
        getTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setTransactionsHistory
      }
    }>
      {children}
    </TransactionHistoryContext.Provider>
  );
}
