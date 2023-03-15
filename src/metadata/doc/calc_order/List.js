import React from 'react';
import Typography from '@mui/material/Typography';
import DataGrid from 'react-data-grid';
import {useNavigate} from 'react-router-dom';
import {Content} from '../../../components/App/styled';
import {useTitleContext} from '../../../components/App';
import ListToolbar from './ListToolbar';


const {adapters: {pouch}, cat: {scheme_settings}, doc: {calc_order}} = $p;
const scheme = scheme_settings
  .find_schemas('doc.calc_order', true)
  .find(({name}) => name.endsWith('.main'));
const {fields} = calc_order.metadata();
const columns = scheme.rx_columns({mode: 'ts', fields, _mgr: calc_order});

const listName = 'Расчёты-заказы (список)';
const title =  {title: listName, appTitle: <Typography variant="h6" noWrap>{listName}</Typography>};

function isAtBottom({ currentTarget }) {
  return currentTarget.scrollTop + 10 >= currentTarget.scrollHeight - currentTarget.clientHeight;
}

function loadMoreRows(newRowsCount, skip, setRows, setError) {
  const sprm = {
    columns,
    skip,
    limit: newRowsCount,
    _owner: null,
  };
  const selector = calc_order.mango_selector ? calc_order.mango_selector(scheme, sprm) : scheme.mango_selector(sprm);
  const opts = {
    method: 'post',
    headers: new Headers({suffix: pouch.props._suffix || '0'}),
    body: JSON.stringify(selector)
  };

  return pouch.fetch('/r/_find', opts)
    .then((res) => res.json())
    .then((data) => {
      setRows((rows) => [...rows, ...data.docs]);
    })
    .catch(setError);
}

function rowKeyGetter(row) {
  return row.ref;
}

function preventDefault(event) {
  event.preventGridDefault();
  event.preventDefault();
}

export default function CalcOrderList() {
  const [rows, setRows] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState(new Set());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const navigate = useNavigate();
  const {setTitle} = useTitleContext();

  React.useEffect(() => {
    loadMoreRows(50, 0, setRows, setError);
    setTitle(title);
  }, []);

  const onCellClick = ({row, column, selectCell}) => {
    if(!selectedRows.size || Array.from(selectedRows)[0] !== row.ref) {
      setSelectedRows(new Set([row.ref]));
    }
  };

  function onCellKeyDown({ mode, row, column, rowIdx, selectCell }, event) {
    if (mode === 'EDIT' || !rows.length) return;
    const { idx } = column;
    const { key, shiftKey } = event;

    if(key === 'Enter') {
      onCellDoubleClick({row, column, selectCell});
    }
    else if (key === 'ArrowDown') {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx});
        setSelectedRows(new Set([rows[rowIdx + 1].ref]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowRight' || (key === 'Tab' && !shiftKey)) && idx === columns.length - 1) {
      if (rowIdx < rows.length - 1) {
        selectCell({rowIdx: rowIdx + 1, idx: 0});
        setSelectedRows(new Set([rows[rowIdx + 1].ref]));
      }
      preventDefault(event);
    }
    else if (key === 'ArrowUp') {
      if(rowIdx > 0) {
        selectCell({rowIdx: rowIdx - 1, idx});
        setSelectedRows(new Set([rows[rowIdx - 1].ref]));
      }
      preventDefault(event);
    }
    else if ((key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) && idx === 0) {
      if(rowIdx > 0) {
        selectCell({ rowIdx: rowIdx - 1, idx: columns.length - 1 });
        setSelectedRows(new Set([rows[rowIdx - 1].ref]));
      }
      preventDefault(event);
    }
  }

  const onCellDoubleClick = ({column, row, selectCell}, evt) => {
    navigate(`${row.ref}`);
  };

  return <Content>
    <ListToolbar selectedRows={selectedRows}/>
    <DataGrid
      columns={columns}
      rows={rows}
      rowKeyGetter={rowKeyGetter}
      onRowsChange={setRows}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      onCellClick={onCellClick}
      onCellDoubleClick={onCellDoubleClick}
      onCellKeyDown={onCellKeyDown}
      className="fill-grid"
      rowHeight={33}
    />
  </Content>;
}
