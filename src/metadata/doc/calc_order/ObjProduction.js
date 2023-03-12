import React from 'react';
import DataGrid from 'react-data-grid';
import {didablePermanent} from '../../../styles/muiTheme';
import ObjProductionToolbar from './ObjProductionToolbar';

const {adapters: {pouch}, cat: {scheme_settings}, doc: {calc_order}} = $p;
const scheme = scheme_settings
  .find_schemas('doc.calc_order.production', true)
  .find(({name}) => name.endsWith('.main'));
const {fields} = calc_order.metadata('production');
const columns = scheme.rx_columns({mode: 'ts', fields, _mgr: calc_order});

export default function ObjProduction({tabRef, obj}) {
  const style = {minHeight: 420, minWidth: 360};
  if(tabRef?.current) {
    if(!didablePermanent) {
      const top = tabRef.current.offsetTop + tabRef.current.offsetHeight + 51;
      style.height = `calc(100vh - ${top}px)`;
    }
    style.width = tabRef.current.offsetWidth;
  }
  return <div style={style}>
    <ObjProductionToolbar/>
    <DataGrid
      columns={columns}
      rows={obj.production._obj}
      className="fill-grid"
      rowHeight={33}
    />
  </div>;
}
