import React, { createContext, useState, useCallback } from 'react';

// URI's
const hostname = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  process.env.REACT_APP_API_DEV_URL :
  process.env.REACT_APP_API_PROD_URL;

const getCategoriesURI = process.env.REACT_APP_API_GETCATEGORIES;
const newCategoryURI = process.env.REACT_APP_API_NEWCATEGORY;
const updateCategoryURI = process.env.REACT_APP_API_UPDATECATEGORY;
const deleteCategoryURI = process.env.REACT_APP_API_DELETECATEGORY;

// static URL's
const newCategoryURL = `${hostname}/${newCategoryURI}`;
const updateCategoryURL = `${hostname}/${updateCategoryURI}`;
const deleteCategoryURL = `${hostname}/${deleteCategoryURI}`;

// creating the context
export const CategoriesContext = createContext(undefined);

// provider component
export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState(undefined);
  const [categoriesIsLoading, setCategoriesIsLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(false);

    // START actions
    const addCategory = useCallback(
      (currentUser, categoryName, month, year) => {
        return fetch(newCategoryURL, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            uid: currentUser.uid,
            category_name: categoryName,
            month: month,
            year: year
          })
        });
      },
      []
    );

    const getCategories = useCallback(
      (uid, month, year) => {
        setCategoriesIsLoading(true);
        fetch(`${hostname}/${getCategoriesURI}/?year=${year}&month=${month}&uid=${uid}`, {
          method: 'GET', 
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
        }).then(resp => {
          return resp.json(); 
        }).then(data => {
          setCategories(data);
          setCategoriesIsLoading(false);
        }).catch(error => {
          console.warn('Failed to get categories:', error);
          setCategoriesIsLoading(false);
          setCategoriesError(true);
        });
      },
      [setCategories, setCategoriesIsLoading, setCategoriesError]
    );

    const updateCategory = useCallback(
      (uid, categoryId, newCategoryName, month, year) => {
        return fetch((updateCategoryURL + `/${categoryId}`), {
          method: 'PUT',
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            month,
            year,
            uid,
            category_name: newCategoryName,
          })
        });
      },
      []
    );

    const deleteCategory = useCallback(
      (categoryId) => {
        return fetch((deleteCategoryURL + `/${categoryId}`), {
          method: 'delete',
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
        })
      },
      []
    );
    // END actions

  return (
    <CategoriesContext.Provider value={
      {
        categoriesIsLoading,
        categoriesError,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategories,
        setCategories
      }
    }>
      {children}
    </CategoriesContext.Provider>
  );
}
