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

function generateOverLimits(budget, transactionsHistory, selectedPercentage) {
  const subcategoriesLookupTable = generateSubcategoriesLookupTable(budget);
  // unique subcategories within transaction, not budget
  const uniqueSubcategories = generateUniqueSubcategories(transactionsHistory);
  const budgetSubcategoriesLookup = new Map();
  const transacSubcategoriesLookup = new Map();
  let max = 0;

  for (const category of budget) {
    for (const subcategory of category.subcategories) {
      max = Math.max(max, subcategory.allotment);
      budgetSubcategoriesLookup.set(subcategory.subcategory_name, subcategory.allotment);
      transacSubcategoriesLookup.set(subcategory.subcategory_name, 0);
    }
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
  console.log(max, selectedPercentage);
  console.log(max * selectedPercentage);
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

  useLayoutEffect(
    () => {
      if (divRef.current) {
        const width = divRef.current.offsetWidth;
        setResponsiveWidth(width);
      }
    },
    [divRef]
  );

  const handleChange = useCallback(
    (event) => {
      setSelectedPercentage(+event.target.value);
    },
    [setSelectedPercentage]
  );

  const overLimitData = useMemo(
    () => generateOverLimits(budget, transactionsHistory, selectedPercentage),
    [budget, transactionsHistory, selectedPercentage]
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
          top: 100,
          bottom: responsiveWidth > 768 ? 200 : 20,
          left: 100,
          right: responsiveWidth > 768 ? 20 : 30
        },
        hAxis: {
          slantedText: responsiveWidth > 769 ? true : false,
          slantedTextAngle: 90,
          
        },
        vAxis: {
          format: 'currency'
        },
        legend: 'top',
        height: 800,
        colors: ['#35727B', '#A34730']
      }
    
    },
    [responsiveWidth]
  );
  
  return (
    <div ref={divRef}>
      <Grid container>
        <Grid item xs={4} className={classes.filterSelectContainer}>
          <FormControl fullWidth>
            <InputLabel>Filter</InputLabel>
            <Select
              value={selectedPercentage}
              onChange={handleChange}
            >
              <MenuItem value={1}>{'<= 100%'}</MenuItem>
              <MenuItem value={.75}>{'<= 75%'}</MenuItem>
              <MenuItem value={.50}>{'<= 50%'}</MenuItem>
              <MenuItem value={.25}>{'<= 25%'}</MenuItem>
              <MenuItem value={.20}>{'<= 20%'}</MenuItem>
              <MenuItem value={.15}>{'<= 15%'}</MenuItem>
              <MenuItem value={.10}>{'<= 10%'}</MenuItem>
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