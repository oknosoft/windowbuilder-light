/**
 * Строки текущего заказа поставщику
 *
 * @module OrderRows
 *
 * Created by Evgeniy Malyarov on 26.02.2020.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CustomToolbar from '../AdditionsExt/CustomToolbar';
import Paper from '@material-ui/core/Paper';
import TabularSection from 'metadata-react/TabularSection';

const stub = {
  goods: {
    count() {return 0;}
  }
};

const formatter = ({row, value}) => {
  const {orders} = row.calc_order;
  const orow = orders.find({invoice: row._owner._owner});
  const prow = orow && orow.is_supplier.nom.find({identifier: value});
  return <div>{prow ? prow.name : value}</div>;
};

formatter.propTypes = {
  row: PropTypes.object,
  value: PropTypes.any,
};

const columnsChange = ({scheme, columns}) => {
  for(const column of columns) {
    if(column.key === "identifier") {
      column.formatter = formatter;
    }
  }
};

function OrderRows({invoice, row, calc_order, setRow, scheme}) {

  const {goods} = invoice || stub;

  const handleAdd = () => {
    const row = goods.add({quantity: 1, calc_order});
    setRow(row);
  };

  const handleRemove = () => {
    if(row) {
      setRow(null);
      goods.del(row);
    }
    else {
      $p.ui.dialogs.alert({text: 'Не указана текущая строка', title: 'Внешний параметрик'});
    }
  };

  const cellSelect = ({idx, rowIdx}) => {
    const srow = goods.get(rowIdx);
    if(row !== srow) {
      setRow(srow);
    }
  };

  let minHeight = 120;
  const count = goods.count();
  if(count) {
    minHeight += (33 * ((count < 8 ? count : 8) - 1));
  }

  const Toolbar = () => {
    return <CustomToolbar handleAdd={handleAdd} handleRemove={handleRemove} count={count}/>;
  };

  return <Grid item xs={12} md={5}>
    <Paper variant="outlined" square>
      {invoice &&
      <div style={{paddingRight: 1, height: minHeight + 35}}>
        <TabularSection
          _obj={invoice}
          _tabular="goods"
          onCellSelected={cellSelect}
          minHeight={minHeight}
          Toolbar={Toolbar}
          scheme={scheme}
          columnsChange={columnsChange}
        />
      </div>}
    </Paper>
  </Grid>;
}

OrderRows.propTypes = {
  invoice: PropTypes.object,
  row: PropTypes.object,
  calc_order: PropTypes.object,
  scheme: PropTypes.object,
  setRow: PropTypes.func.isRequired,
};

export default OrderRows;
