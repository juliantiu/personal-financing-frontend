import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import useStyles from '../../../hooks/useStyles';

const yearsList = [
  2020,
  2021,
  2022,
  2023,
  2024,
  2025,
  2026,
  2027,
  2028,
  2029,
  2030
];  

export default function YearSelector(props) {
  const classes = useStyles();
  const { year, setYear } = props;

  const handleChange = (_, newYear) => {
    setYear(newYear);
  }

  return (
    <AppBar position="static" className={classes.yearSelectorAppBar}>
      <Tabs
        value={year}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {yearsList.map(year => <Tab key={year} label={year} value={year} />)}
      </Tabs>
    </AppBar>
  );
}