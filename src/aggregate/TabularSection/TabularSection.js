import React from 'react';
import DataGrid from 'react-data-grid';
import {useLoadingContext} from '../Metadata';
import {useBackdropContext} from '../App/backdropContext';
import {SelectedContext, useSelectedContext} from './selectedContext';

import {NumberCell, NumberFormatter} from '@oknosoft/ui/DataField/Number';
import {PresentationFormatter} from '@oknosoft/ui/DataField/RefField';

const columns = [
  {key: "sz", name: "Размер", width: '*', renderEditCell: NumberCell, renderCell: NumberFormatter},
  {key: "inset", name: "Вставка", width: 120, renderCell: PresentationFormatter},
];


export default function TabularSection({tabRef, obj, ts, selection}) {

  const {ifaceState: {menu_open}} = useLoadingContext();
  const style = {minHeight: 320, width: '100%'};
  if(tabRef?.current) {
    const top = tabRef.current.offsetTop + tabRef.current.offsetHeight + 51;
    style.height = `calc(100vh - ${top}px)`;
  }
  const {setBackdrop, setSnack} = useBackdropContext();
  const glob = useSelectedContext();
  const [rows, rawSetRows] = React.useState([]);
  const [selectedRows, rawSetSelectedRows] = React.useState(new Set());

  const setRows = (rows) => {
    if(glob.rows !== rows) {
      glob.rows = rows;
      rawSetRows(rows);
    }
  };

  const setSelectedRows = (rows) => {
    const skey = rows.size && Array.from(rows)[0];
    if(glob.skey !== skey) {
      glob.skey = skey;
      rawSetSelectedRows(rows);
    }
  };

  React.useEffect(() => {
    setRows($p.utils.find.rows(obj[ts], selection));
  }, []);

  return <div style={style}>
    {/*
    <Toolbar
      obj={obj}
      rows={rows}
      getRow={getRow}
      setRows={setRows}
      setBackdrop={setBackdrop}
      setModified={setModified}
      selectedRowsChange={selectedRowsChange}
    />
    */}
    <SelectedContext.Provider value={glob}>
      <DataGrid
        //rowKeyGetter={rowKeyGetter}
        columns={columns}
        rows={rows}
        //onRowsChange={onRowsChange}
        //headerRowHeight={33}
        //rowHeight={rowHeight}
        className="fill-grid"
        //enableVirtualization={false}
        //onCellKeyDown={onCellKeyDown}
        //onCellClick={onCellClick}
        //selectedRows={selectedRows}
        //onSelectedRowsChange={selectedRowsChange}
      />
    </SelectedContext.Provider>
  </div>;

}
