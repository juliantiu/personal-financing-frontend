import React, { useMemo, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { Chart } from 'react-google-charts';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import useStyles from '../../../../hooks/useStyles';

function generateUniqueSubcategories(transactionsHistory) {
  return new Set(transactionsHistory.map(transaction => transaction.subcategory_id));
}

function generateSubcategoriesLookupTable(budget) {
  const subcategoriesLookupTable = new Map();

  for (const category of budget) {
    for (const subcategory of category.subcategories) {
      subcategoriesLookupTable.set(subcategory.id, subcategory.subcategory_name);
    }
  }

  return subcategoriesLookupTable;
}

function generateOverLimits(budget, transactionsHistory, selectedPercentage, sort) {
  const subcategoriesLookupTable = generateSubcategoriesLookupTable(budget);
  // unique subcategories within transaction, not budget
  const uniqueSubcategories = generateUniqueSubcategories(transactionsHistory);
  let budgetSubcategoriesLookup = new Map();
  const transacSubcategoriesLookup = new Map();
  let max = 0;

  for (const category of budget) {
    for (const subcategory of category.subcategories) {
      max = Math.max(max, subcategory.allotment);
      budgetSubcategoriesLookup.set(subcategory.subcategory_name, subcategory.allotment);
      transacSubcategoriesLookup.set(subcategory.subcategory_name, 0);
    }
  }
  
  switch (sort) {
    case 1:
      // most expensive to least expensive
      budgetSubcategoriesLookup = new Map([...budgetSubcategoriesLookup].sort((a, b) => b[1] > a[1] ? 1 : -1));
      break;
    case 2:
      // least expensive to most expensive
      budgetSubcategoriesLookup = new Map([...budgetSubcategoriesLookup].sort((a, b) => a[1] > b[1] ? 1 : -1));
      break;
    default:
      budgetSubcategoriesLookup = new Map([...budgetSubcategoriesLookup].sort((a, b) => a[0] > b[0] ? 1 : -1));
      break;
  }

  for (const subcategory of uniqueSubcategories) {
    const filteredTransactions = transactionsHistory.filter(
      transaction => transaction.subcategory_id === subcategory
    );

    let spent = 0;
    for (const transaction of filteredTransactions) {
      spent += transaction.cost
    }
    transacSubcategoriesLookup.set(subcategoriesLookupTable.get(subcategory), spent);
  }

  const overLimit = [['Subcategory', 'Allotment', 'Spent']];

  if (selectedPercentage > 1) {
    for (const [key, value] of budgetSubcategoriesLookup) {
      if (value > (max * (selectedPercentage / 100))) {
        overLimit.push([key, value, transacSubcategoriesLookup.get(key)]);
      }
    }

    return overLimit;
  }

  for (const [key, value] of budgetSubcategoriesLookup) {
    if (value <= (max * selectedPercentage)) {
      overLimit.push([key, value, transacSubcategoriesLookup.get(key)]);
    }
  }

  return overLimit;
}

export default function OverLimit(props) {
  const classes = useStyles();
  const { budget, transactionsHistory } = props;
  const divRef = useRef(null);
  const [responsiveWidth, setResponsiveWidth] = useState(undefined);
  const [selectedPercentage, setSelectedPercentage] = useState(1);
  const [sort, setSort] = useState(0);

  useLayoutEffect(
    () => {
      if (divRef.current) {
        const width = divRef.current.offsetWidth;
        setResponsiveWidth(width);
      }
    },
    [divRef]
  );

  const handlePercentageChange = useCallback(
    (event) => {
      setSelectedPercentage(+event.target.value);
    },
    [setSelectedPercentage]
  );

  const handleSortChange = useCallback(
    (event) => {
      setSort(+event.target.value);
    },
    [setSort]
  );

  const overLimitData = useMemo(
    () => generateOverLimits(budget, transactionsHistory, selectedPercentage, sort),
    [budget, transactionsHistory, selectedPercentage, sort]
  );

  const overLimitOptions = useMemo(
    () => {
      return {
        explorer: {
          axis: 'vertical',
          actions: ['dragToZoom', 'rightClickToReset'],
          keepInBounds: true,
          maxZoomIn: 4.0
        },
        chartArea: {
          top: responsiveWidth > 768 ? 50 : 70,
          bottom: responsiveWidth > 768 ? 200 : 40,
          left: 100,
          right: responsiveWidth > 768 ? 20 : 40
        },
        hAxis: {
          slantedText: responsiveWidth > 768 ? true : false,
          slantedTextAngle: 90,
          format: responsiveWidth > 768 ? '' : 'currency'
          
        },
        vAxis: {
          format: responsiveWidth > 768 ? 'currency' : ''
        },
        legend: 'top',
        height: responsiveWidth > 768 ? 800 : 900,
        colors: ['#35727B', '#A34730']
      }
    
    },
    [responsiveWidth]
  );
  
  return (
    <div ref={divRef}>
      <Grid container>
        <Grid item xs={responsiveWidth > 768 ? 4 : 12} className={classes.filterSelectContainer}>
          <FormControl fullWidth>
            <InputLabel>Filter</InputLabel>
            <Select
              value={selectedPercentage}
              onChange={handlePercentageChange}
            >
              <MenuItem value={75}>{'>= 75%'}</MenuItem>
              <MenuItem value={50}>{'>= 50%'}</MenuItem>
              <MenuItem value={25}>{'>= 25%'}</MenuItem>
              <MenuItem value={20}>{'>= 20%'}</MenuItem>
              <MenuItem value={15}>{'>= 15%'}</MenuItem>
              <MenuItem value={10}>{'>= 10%'}</MenuItem>
              <MenuItem value={5}>{'>= 5%'}</MenuItem>
              <MenuItem value={1}>{'<= 100%'}</MenuItem>
              <MenuItem value={.75}>{'<= 75%'}</MenuItem>
              <MenuItem value={.50}>{'<= 50%'}</MenuItem>
              <MenuItem value={.25}>{'<= 25%'}</MenuItem>
              <MenuItem value={.20}>{'<= 20%'}</MenuItem>
              <MenuItem value={.15}>{'<= 15%'}</MenuItem>
              <MenuItem value={.10}>{'<= 10%'}</MenuItem>
              <MenuItem value={.05}>{'<= 5%'}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={responsiveWidth > 768 ? 4 : 12} className={classes.filterSelectContainer}>
          <FormControl fullWidth>
            <InputLabel>Sort</InputLabel>
            <Select
              value={sort}
              onChange={handleSortChange}
            >
              <MenuItem value={0}>Alphabetical</MenuItem>
              <MenuItem value={1}>Most expensive to least expensive</MenuItem>
              <MenuItem value={2}>Lest expensive to most expensive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Chart
            chartType={responsiveWidth > 768 ? 'ColumnChart' : 'BarChart'}
            data={overLimitData.length > 1 ? overLimitData : [['Subcategory', 'Allotment', 'Spent'], [0,0,0]]}
            loader={<div>Loading Subcategory Limits...</div>}
            width={responsiveWidth}
            options={overLimitOptions}
          />
        </Grid>
      </Grid>
    </div>
  );
}