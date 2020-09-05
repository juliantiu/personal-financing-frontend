import React, { createContext, useState, useCallback } from 'react';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_DEV_URL :
  process.env.REACT_APP_API_PROD_URL;

const getSubcategoriesURI = process.env.REACT_APP_API_GETSUBCATEGORIES;
const newSubcategoryURI = process.env.REACT_APP_API_NEWSUBCATEGORY;
const updateSubcategoryURI = process.env.REACT_APP_API_UPDATESUBCATEGORY;
const deleteSubcategoryURI = process.env.REACT_APP_API_DELETESUBCATEGORY;

// static URL's
const newSubcategoryURL = `${hostname}/${newSubcategoryURI}`;
const updateSubcategoryURL = `${hostname}/${updateSubcategoryURI}`;
const deleteSubcategoryURL = `${hostname}/${deleteSubcategoryURI}`;


// creating the context
export const SubcategoriesContext = createContext(undefined);

// provider component
export const SubcategoriesProvider = ({ children }) => {
  const [subcategories, setSubcategories] = useState(undefined);
  const [subcategoriesIsLoading, setSubcategoriesIsLoading] = useState(false);
  const [subcategoriesError, setSubcategoriesError] = useState(false);

  // START actions
  const getSubcategories = useCallback(
    (categories) => {
      setSubcategoriesIsLoading(true);
      return fetch(`${hostname}/${getSubcategoriesURI}`, {
        method: 'POST', 
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          categories
        })
      }).then(resp => { 
        return resp.json(); 
      }).then(data => {
        setSubcategories(data);
        setSubcategoriesIsLoading(false);
      }).catch(error => {
        setSubcategoriesIsLoading(false);
        setSubcategoriesError(true);
        console.warn('Failed to get subcategories:', error);
      });
    },
    [setSubcategories, setSubcategoriesIsLoading, setSubcategoriesError]
  );

  function addSubcategory(rowData, newData) {
    return fetch(newSubcategoryURL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials:'same-origin',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        category_id: rowData.category,
        subcategory_name: newData.subcategory_name,
        allotment: newData.allotment,
        description: newData.description
      })
    });
  }

  function updateSubcategory(rowData, newData, oldData) {
    return fetch((updateSubcategoryURL + `/${oldData.id}`), {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials:'same-origin',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        category_id: rowData.category,
        subcategory_name: newData.subcategory_name,
        allotment: newData.allotment,
        description: newData.description
      })
    });
  }

  function deleteSubcategory(oldData) {
    return fetch((deleteSubcategoryURL + `/${oldData.id}`), {
      method: 'delete',
      mode: 'cors',
      cache: 'no-cache',
      credentials:'same-origin',
    });
  }
  // END actions

  return (
    <SubcategoriesContext.Provider value={
      {
        subcategoriesIsLoading,
        subcategoriesError,
        subcategories,
        getSubcategories,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
        setSubcategories
      }
    }>
      {children}
    </SubcategoriesContext.Provider>
  );
}
