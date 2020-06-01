import React, { createContext, useState} from 'react';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_DEV_URL :
  process.env.REACT_APP_API_PROD_URL;

const getBudgetURI = process.env.REACT_APP_API_GETBUDGET;
const cloneBudgetURI = process.env.REACT_APP_API_CLONEBUDGET;

// initial state of the budget
const initialbudgetState = [];

// creating the context
export const BudgetContext = createContext(initialbudgetState);

// provider component
export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState(initialbudgetState);

    // START actions
    function getBudget(uid, month, year) {
      return fetch(`${hostname}/${getBudgetURI}/?year=${year}&month=${month}&uid=${uid}`, {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBudget(data);
      })
      .catch(error => {
        console.log('Failed to get budget:', error);
      });
    }

    function cloneBudget(uid, month, year) {
      return fetch(`${hostname}/${cloneBudgetURI}/?year=${year}&month=${month}&uid=${uid}`, {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
      });
    }
    // END actions

  return (
    <BudgetContext.Provider value={
      {
        budget,
        getBudget,
        setBudget,
        cloneBudget
      }
    }>
      {children}
    </BudgetContext.Provider>
  );
}
