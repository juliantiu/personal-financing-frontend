import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const monthList = [
  { index: 0, name: 'January' },
  { index: 1, name: 'February' },
  { index: 2, name: 'March' },
  { index: 3, name: 'April' },
  { index: 4, name: 'May' },
  { index: 5, name: 'June' },
  { index: 6, name: 'July' },
  { index: 7, name: 'August' },
  { index: 8, name: 'September' },
  { index: 9, name: 'October' },
  { index: 10, name: 'Novermber' },
  { index: 11, name: 'December' },
];

export default function MonthSelector(props) {
  const { month, setMonth } = props;

  const handleChange = (_, newMonth) => {
    setMonth(newMonth);
  }

  return (
    <React.Fragment>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={month}
        onChange={handleChange}
        aria-label="Vertical tabs example"
      >
        {monthList.map(month => <Tab key={month.index} label={month.name} value={month.index}/>)}
      </Tabs>
    </React.Fragment>
  );
}