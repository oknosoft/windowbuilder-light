import React from 'react';
import Typography from '@material-ui/core/Typography';
import DataField from 'metadata-react/DataField';

const _obj = $p.cat.templates._select_template;

export default function SelectOrder() {
  const [calc_order, set_calc_order] = React.useState(_obj.calc_order);
  return [
    <Typography key="descr" variant="body2" color="primary">
      Изделия-шаблоны, живут в специальных заказах со статусом <i>Шаблон</i>.<br/>
      По умолчанию, выбор происходит из последнего открытого заказа-шаблона.
      При желании, изделие можно заполнить по образу любого изделия из любого заказа - не обязательно шаблона.
    </Typography>,
    <DataField key="calc_order" _obj={_obj} _fld="calc_order" fullWidth handleValueChange={set_calc_order}/>,
    <DataField key="note" _obj={calc_order} _fld="note" fullWidth read_only/>
  ];
}
