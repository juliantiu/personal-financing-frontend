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

    const addCategory = useCallback(
      (currentUser, categoryName, month, year, callback) => {
        fetch(newCategoryURL, {
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
        })
        .then(response => response.json())
        .then(data => {
          callback();
          setCategories(prev => {
            const prevCopy = [...prev];
            prevCopy.push({
              id: data.id,
              uid: currentUser.uid,
              category_name: categoryName,
              month: month,
              year: year
            });
            return prevCopy;
          });
        })
        .catch((error) => {
          alert('Failed to add new category');
          console.warn(error);
          callback();
        })
      },
      [setCategories]
    );

    const updateCategory = useCallback(
      (uid, categoryId, newCategoryName, month, year, callback) => {
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
        })
        .then(() => {
          callback();
          setCategories(prev => {
            const prevCopy = [...prev];
            const indexOfCategory= prevCopy.findIndex(category => category.id === categoryId);
            const updatedCategory = {
              id: categoryId,
              month,
              year,
              uid,
              category_name: newCategoryName
            };
            prevCopy[indexOfCategory] = updatedCategory;
            return prevCopy;
          });
        })
        .catch(() => {
          alert('Failed to update category');
          callback();
        });
      },
      [setCategories]
    );

    const deleteCategory = useCallback(
      (categoryId, callback) => {
        fetch((deleteCategoryURL + `/${categoryId}`), {
          method: 'delete',
          mode: 'cors',
          cache: 'no-cache',
          credentials:'same-origin',
        })
        .then(() => {
          callback();
          setCategories(prev => {
            const prevCopy = [...prev];
            return prevCopy.filter(category => category.id !== categoryId);
          });
        })
        .catch(() => {
          alert('Failed to delete category');
          callback();
        })
      },
      [setCategories]
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
