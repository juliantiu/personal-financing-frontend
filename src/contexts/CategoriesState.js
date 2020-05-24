import React, { createContext, useState } from 'react';

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

// initial state of categories
const initialCategoriesState = [];

// creating the context
export const CategoriesContext = createContext(initialCategoriesState);

// provider component
export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState(initialCategoriesState);

    // START actions
    function addCategory(currentUser, categoryName, month, year) {
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
    }

    function getCategories(uid, month, year) {
      fetch(`${hostname}/${getCategoriesURI}/?year=${year}&month=${month}&uid=${uid}`, {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
      }).then(resp => { 
        return resp.json(); 
      }).then(data => {
        setCategories(data);
      }).catch(error => {
        alert(error);
      });
    }

    function updateCategory(uid, categoryId, newCategoryName, month, year) {
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
    }

    function deleteCategory(categoryId) {
      return fetch((deleteCategoryURL + `/${categoryId}`), {
        method: 'delete',
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin',
      })
    }
    // END actions

  return (
    <CategoriesContext.Provider value={
      {
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
