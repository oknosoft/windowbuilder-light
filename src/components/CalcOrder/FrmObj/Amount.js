import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default function Amount({row}) {
  return <span>
    <Typography variant="h6" color="secondary" component="span">
      {`${row.amount.toLocaleString('ru-RU')} `}
    </Typography>
    <Typography component="span">
      руб
    </Typography>
    </span>;
}

Amount.propTypes = {
  row: PropTypes.object.isRequired,
};
