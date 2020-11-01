import React, { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { TransactionHistoryContext } from '../../../../contexts/TransactionHistoryState';

export default function DetailPanel(props){
  const { currentUser, month, year, setIsLoading } = props;
  const { description, subcategory_id, cost, date } = props.rowData;
  const { updateTransaction } = useContext(TransactionHistoryContext);
  const [value, setValue] = useState('Controlled');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const submit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const newData = { subcategory_id, cost, date, description: value };
    const cb = () => {
      setIsLoading(false);
    };
    updateTransaction(props.rowData, newData, currentUser, month, year, cb);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <form onSubmit={event => submit(event)}>
          <TextField
            id="outlined-multiline-static"
            label="Description - hit enter when you're finished updating"
            defaultValue={description}
            variant="outlined"
            onChange={handleChange}
            fullWidth
          />
        </form> 
      </Grid>
    </Grid>
  );
}