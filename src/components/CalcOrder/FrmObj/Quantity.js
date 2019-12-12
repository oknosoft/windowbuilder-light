import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { withStyles } from '@material-ui/core/styles';

const styles = (/*theme*/) => ({
  root: {
    maxWidth: 120,
  },
  input: {
    textAlign: 'center'
  }
});

function Quantity({row, classes}) {

  const dec = () => {
    if(row.quantity > 1) {
      row.quantity--;
    }
  };

  const inc = () => {
    row.quantity++;
  };

  const prevent = event => {
    event.preventDefault();
  };

  return <TextField
    className={classes.root}
    label="Количество"
    variant="outlined"
    value={row.quantity}
    inputProps={{
      className: classes.input,
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <IconButton
            size="small"
            onClick={dec}
            onMouseDown={prevent}
          >
            <RemoveIcon />
          </IconButton>
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            size="small"
            onClick={inc}
            onMouseDown={prevent}
          >
            <AddIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />;
}


Quantity.propTypes = {
  row: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Quantity);
