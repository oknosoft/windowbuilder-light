import React from 'react';
import DataGrid from 'react-data-grid';
import {useLoadingContext} from '../../../components/Metadata';
import {disablePermanent, drawerWidth} from '../../../styles/muiTheme';
import ObjPlanToolbar from './ObjPlanToolbar';

const {adapters: {pouch}, cat: {scheme_settings}, doc: {work_centers_task: mgr}} = $p;
const scheme = scheme_settings.get('c864d895-ac50-42be-8760-203cc46d208f');
const {fields} = mgr.metadata('planning');
const columns = scheme.rx_columns({mode: 'ts', fields, _mgr: mgr});

export default function ObjPlan({tabRef, obj}) {
  const {ifaceState: {menu_open}} = useLoadingContext();
  const style = {minHeight: 420, width: window.innerWidth - (!disablePermanent && menu_open ? drawerWidth : 0) - 2};
  if(tabRef?.current && !disablePermanent) {
    const top = tabRef.current.offsetTop + tabRef.current.offsetHeight + 51;
    style.height = `calc(100vh - ${top}px)`;
  }

  return <div style={style}>
    <ObjPlanToolbar obj={obj}/>
    <DataGrid
      columns={columns}
      rows={obj.planning._obj}
      className="fill-grid"
      rowHeight={33}
    />
  </div>;
}
