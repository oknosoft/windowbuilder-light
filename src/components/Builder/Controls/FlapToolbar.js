import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tip from '../Tip';
import {useStyles} from './LayersToolbar';


function FlapToolbar({contour, disabled, classes}) {
  const {bounds} = contour;
  return <Toolbar disableGutters variant="dense">
    <Typography color="primary">{`${contour.layer ? "Створка" : "Рама"} №`}</Typography>
    <Typography color="secondary">{contour.cnstr}</Typography>
    <Typography color="primary" className={classes.sp}>{bounds ? '(' : ''}</Typography>
    <Typography color="secondary">{bounds ? `${bounds.width.toFixed()}x${bounds.height.toFixed()}` : ''}</Typography>
    <Typography color="primary" className={classes.title}>{bounds ? ')' : ''}</Typography>
    <Tip title="Обновить параметры">
      <IconButton className={disabled} onClick={() => contour.furn.refill_prm(contour)}><i className="fa fa-retweet" /></IconButton>
    </Tip>
  </Toolbar>;
}

FlapToolbar.propTypes = {
  contour: PropTypes.object,
  disabled: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default useStyles(FlapToolbar);
