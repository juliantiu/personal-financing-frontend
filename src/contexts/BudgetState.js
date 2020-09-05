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
  const [budgetIsLoading, setBudgetIsLoading] = useState(false);
  const [budgetError, setBudgetError] = useState(false);

    // START actions
    const getBudget = useCallback(
      (uid, month, year) => {
        setBudgetIsLoading(true);
        return fetch(`${hostname}/${getBudgetURI}/?year=${year}&month=${month}&uid=${uid}`, {
          method: 'GET', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
        }).then((response) => {
          return response.json();
        }).then((data) => {
          setBudget(data);
          setBudgetIsLoading(false);
        }).catch(error => {
          setBudgetError(true);
          setBudgetIsLoading(false);
          console.warn('Failed to get budget:', error);
        });
      },
      [setBudget, setBudgetIsLoading, setBudgetError]
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
        budgetIsLoading,
        budgetError,
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
