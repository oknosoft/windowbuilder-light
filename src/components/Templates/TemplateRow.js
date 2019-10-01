import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/List';

import {path} from '../App/menu_items';
import withStyles from '../CalcOrder/FrmObj/styles';


function TemplateRow({row: {name, note, ref}, handlers, classes}) {
  return (
    <ListItem className={classes.hovered}>
      <Grid container spacing={3} className={classes.left}>
        <Grid item xs={4}>
          Картинка раздела
        </Grid>
        <Grid item xs={8} onClick={() => {
          handlers.handleNavigate(path(`cat.templates/${ref}`));
        }}>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="subtitle1">{note || 'Описание раздела'}</Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
}

TemplateRow.propTypes = {
  row: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
};

export default withStyles(TemplateRow);
