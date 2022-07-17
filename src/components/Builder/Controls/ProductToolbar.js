import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tip from 'metadata-react/App/Tip';
import {useStyles} from './LayersToolbar';


function ProductToolbar({project, classes}) {
  return <Toolbar disableGutters variant="dense">
    <Typography color="primary" className={classes.title}>Свойства изделия</Typography>
    <Tip title="Обновить параметры">
      <IconButton onClick={() => project._dp.sys.refill_prm(project.ox)}><i className="fa fa-retweet" /></IconButton>
    </Tip>
  </Toolbar>;
}

ProductToolbar.propTypes = {
  project: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

export default useStyles(ProductToolbar);
