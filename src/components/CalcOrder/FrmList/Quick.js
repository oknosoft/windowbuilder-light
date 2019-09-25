/**
 * ### Форма списка без списка
 *
 * @module Quick
 *
 * Created by Evgeniy Malyarov on 25.09.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import SearchField from './SearchField';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import {path} from '../../App/menu_items';
import Fullscreenable from '../../App/Fullscreenable';

const styles = ({spacing}) => ({
  root: {
    padding: spacing(1),
  },
  paddingTop: {
    paddingTop: spacing(2),
  },
  padding: {
    paddingLeft: spacing(),
    paddingRight: spacing(),
  },
  extendedIcon: {
    marginRight: spacing(),
  },
});

const ltitle = 'Быстрые окна: выбор заказа';

class Quick extends React.Component {

  componentDidMount() {
    this.props.handlers.handleIfaceState({
      component: '',
      name: 'title',
      value: ltitle,
    });
  }

  createOrder = () => {
    this.props.handlers.handleNavigate(path(`doc.calc_order/${$p.utils.generate_guid()}?action=new`));
  };

  render() {
    const {classes} = this.props;
    return [
      <Typography>Можно создать новый заказ, либо открыть ранее созданный, если известен его номер или идентификатор</Typography>,
      <Grid container spacing={3} className={classes.paddingTop}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            aria-label="New order"
            classes={{root: classes.margin, label: classes.padding}}
            onClick={this.createOrder}
            title="Создать новый заказ"
          >
            <EditIcon className={classes.extendedIcon} />
            Новый заказ
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <SearchField/>
        </Grid>
      </Grid>,
    ];
  }

}

Quick.propTypes = {
  handlers: PropTypes.object.isRequired,
};

export default withStyles(styles)(Quick);

