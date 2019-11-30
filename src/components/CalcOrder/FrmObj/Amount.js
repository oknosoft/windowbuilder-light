import React from 'react';
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
