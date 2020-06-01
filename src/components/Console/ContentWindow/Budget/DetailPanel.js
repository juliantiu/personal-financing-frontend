import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';

import useStyles from '../../../../hooks/useStyles';

function generateList(id, transactionsHistory) {
  const filteredHistory = transactionsHistory.filter(transaction => transaction.subcategory_id === id);
  return filteredHistory.map((transac, index) => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = new Date(transac.date).toLocaleDateString(undefined, dateOptions);
    return (
    <React.Fragment key={transac.id}>
      <ListItem>
        ${transac.cost} on {dateString}
      </ListItem>
      { index !== filteredHistory.length - 1 ? <Divider /> : ''}
    </React.Fragment>
  )});
}

export default function DetailPanel(props) {
  const classes = useStyles();
  const { id } = props.rowData;
  const { transactionsHistory } = useContext(TransactionHistoryContext);

  return (
    <div className={classes.detailPanel}>
      <Grid container>
        <Grid item xs={12}>
          {generateList(id, transactionsHistory)}
        </Grid>
      </Grid>
    </div>
  );
}