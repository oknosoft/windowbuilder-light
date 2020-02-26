/**
 * Заказы внешним поставщикам, подчиненные текущему заказу покупателя
 *
 * @module Orders
 *
 * Created by Evgeniy Malyarov on 26.02.2020.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CustomToolbar from '../AdditionsExt/CustomToolbar';
import Paper from '@material-ui/core/Paper';

function Orders({_obj, row, setRow}) {

  const {orders} = _obj;

  const handleAdd = () => {
    $p.ui.dialogs.input_value({
      title: 'Укажите поставщика',
      type: 'cat.http_apis',
    })
      .then((is_supplier) => {
        const row = orders.add({is_supplier});
        setRow(row);
      })
      .catch(() => null);
  };

  const handleRemove = () => {
    if(row) {
      setRow(null);
      orders.del(row);
    }
    else {
      $p.ui.dialogs.alert({text: 'Не указана текущая строка', title: 'Внешний параметрик'});
    }
  };

  return <Grid item xs={12} md={2}>
    <Paper variant="outlined" style={{height: '100%'}} square>
      <CustomToolbar handleAdd={handleAdd} handleRemove={handleRemove} count={orders.count()}/>
      <List>
        {orders._obj.map(({_row}) => <ListItem
          key={`or_${_row.row}`}
          button
          selected={_row === row}
          onClick={() => setRow(_row)}
        >
          <ListItemText primary={_row.is_supplier.name} />
        </ListItem>)}
      </List>
    </Paper>
  </Grid>;
}

Orders.propTypes = {
  _obj: PropTypes.object.isRequired,
  row: PropTypes.object,
  setRow: PropTypes.func.isRequired,
};

export default Orders;
