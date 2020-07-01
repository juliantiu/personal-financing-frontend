import React, { createContext, useState, useCallback} from 'react';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_DEV_URL :
  process.env.REACT_APP_API_PROD_URL;

const getBudgetURI = process.env.REACT_APP_API_GETBUDGET;
const cloneBudgetURI = process.env.REACT_APP_API_CLONEBUDGET;

// creating the context
export const BudgetContext = createContext(undefined);

// provider component
export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState(undefined);

    // START actions
    const getBudget = useCallback(
      (uid, month, year) => {
        return fetch(`${hostname}/${getBudgetURI}/?year=${year}&month=${month}&uid=${uid}`, {
          method: 'GET', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
        }).then((response) => {
          return response.json();
        }).then((data) => {
          setBudget(data);
        }).catch(error => {
          console.warn('Failed to get budget:', error);
        });
      },
      [setBudget]
    );

    const cloneBudget = useCallback(
      (uid, month, year) => {
        return fetch(`${hostname}/${cloneBudgetURI}/?year=${year}&month=${month}&uid=${uid}`, {
          method: 'GET', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
        });
      },
      []
    );
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
