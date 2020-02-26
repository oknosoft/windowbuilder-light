/**
 * Параметры текущей строки текущего заказа поставщику
 *
 * @module OrderRowProps
 *
 * Created by Evgeniy Malyarov on 26.02.2020.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import OrderProp from './OrderProp';

function OrderRowProps({row, supplier}) {
  let params, sprms, srow;
  if(row && supplier) {
    srow = supplier.nom.find({identifier: row.identifier});
    if(srow && srow.params) {
      try {
        sprms = JSON.parse(srow.params);
      }/* eslint-disable-next-line */
      catch (e) {}
    }
    if(row.params) {
      try {
        params = JSON.parse(row.params);
      }
      catch (e) {}
    }
    if(Array.isArray(sprms)) {
      if(!params) {
        params = {};
      }
      for(const prm of sprms) {
        if(!prm.id || ['nom','note'].includes(prm.id)) {
          continue;
        }
        if(!params.hasOwnProperty(prm.id)) {
          const {type, subtype, values} = supplier.prm(prm.id);
          if(values && values.length) {
            params[prm.id] = values[0].ref || values[0];
          }
          else {
            params[prm.id] = subtype === 'number' || type === 'number' ? 0 : '';
          }
        }
      }
      params = new Proxy(params, {
        set (target, fld, value) {
          const {type, subtype} = supplier.prm(fld);
          target[fld] = subtype === 'number' || type === 'number' ? (parseFloat(value) || 0) : value;
          row.params = JSON.stringify(target);
          return true;
        }
      });
    }
    else {
      params = undefined;
    }

  }
  return <Grid item xs={12} md={5}>
    <Paper variant="outlined" style={{height: '100%'}} square>
      {!row && <Typography variant="subtitle1" color="secondary">Не выбрана строка продукции</Typography>}
      {row && !params && <Typography variant="subtitle1" color="secondary">Для текущей продукции не требуются параметры</Typography>}
      {row && params && <Typography variant="subtitle1">Параметры</Typography>}
      {row && params && Object.keys(params).map((_fld) => <OrderProp key={_fld} _fld={_fld} _obj={params} sprms={sprms} supplier={supplier}/>)}
    </Paper>
  </Grid>;
}

OrderRowProps.propTypes = {
  row: PropTypes.object,
  supplier: PropTypes.object,
};

export default OrderRowProps;
