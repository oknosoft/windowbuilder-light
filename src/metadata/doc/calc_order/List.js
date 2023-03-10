import React from 'react';
import DataGrid from 'react-data-grid';
import {useNavigate} from 'react-router-dom';
import {Content} from '../../../components/App/styled';
import ListToolbar from './ListToolbar';


const {adapters: {pouch}, cat: {scheme_settings}, doc: {calc_order}} = $p;
const scheme = scheme_settings
  .find_schemas('doc.calc_order', true)
  .find(({name}) => name.endsWith('.main'));
const {fields} = calc_order.metadata();
const columns = scheme.rx_columns({mode: 'ts', fields, _mgr: calc_order});

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

export default function CalcOrderList() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    loadMoreRows(50, 0, setRows, setError);
  }, []);

  const onCellClick = (...attr) => {
    console.log(...attr);
  };

  const onCellDoubleClick = ({column, row, selectCell}, evt) => {
    navigate(`/doc/calc_order/${row.ref}`);
  };

  return <Content>
    <ListToolbar/>
    <DataGrid
      columns={columns}
      rows={rows}
      rowKeyGetter={rowKeyGetter}
      onRowsChange={setRows}
      onCellClick={onCellClick}
      onCellDoubleClick={onCellDoubleClick}
      className="fill-grid"
      rowHeight={33}
    />
  </Content>;
}
