import React, { createContext, useState } from 'react';
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
const initialTransactionHistoryState = [];

// creating the context
export const TransactionHistoryContext = createContext(initialTransactionHistoryState);

// provider component
export const TransactionHistoryProvider = ({ children }) => {
  // Howcome this { currentUser } worked without the provider?
  // Is the AuthProvider actually in scope becuase the usage of this
  // is within the <ContentWindow /> component?
  // const { currentUser } = useContext(AuthContext);
  const [transactionsHistory, setTransactionsHistory] = useState(initialTransactionHistoryState);

    // START actions
    function getTransactions(uid, month, year) {
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
      })
      .catch(error => {
        console.log('Failed to get transaction history:', error);
      });
    }

    function addTransaction(newData, currentUser, month, year) {
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
    }

    function updateTransaction(oldData, newData, currentUser, month, year) {
      return fetch((`${updateTransactionURL}/${oldData.id}`), {
        method: 'PUT',
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
          description: newData.description,
          date: newData.date,
          month,
          year
        })
      })
    }

    function deleteTransaction(oldData, month, year) {
      return fetch((deleteTransactionURL + `/${oldData.id}`), {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
      })
    }
    // END actions

  return (
    <TransactionHistoryContext.Provider value={
      {
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
