import React from 'react';
import Typography from '@mui/material/Typography';
import DataGrid from 'react-data-grid';
import {useNavigate} from 'react-router-dom';
import {Content} from '../../../components/App/styled';
import {useTitleContext, useBackdropContext} from '../../../components/App';
import ListToolbar from './ListToolbar';
import {rowKeyGetter, cellClick, cellKeyDown, mgrCreate} from '../../dataGrid';


const {adapters: {pouch}, cat: {scheme_settings}, doc: {calc_order}, utils} = $p;
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

function loadMoreRows(newRowsCount, skip, ref, backdrop) {

  backdrop.setBackdrop(true);

  const sprm = {
    columns,
    skip,
    limit: newRowsCount,
    _owner: null,
  };

  const selector = calc_order.mango_selector ? calc_order.mango_selector(scheme, sprm) : scheme.mango_selector(sprm);
  if(ref) {
    selector.ref = ref;
  }
  const opts = {
    method: 'post',
    headers: new Headers({suffix: pouch.props._suffix || '0'}),
    body: JSON.stringify(selector)
  };

  return pouch.fetch('/r/_find', opts)
    .then((res) => {
      backdrop.setBackdrop(false);
      return res.json();
    })
    .catch((err) => {
      backdrop.setBackdrop(false);
      throw err;
    });
}

export default function CalcOrderList() {
  const [rows, setRows] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState(new Set());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const backdrop = useBackdropContext();
  const {setTitle} = useTitleContext();

  React.useEffect(() => {
    setTitle(title);
    const {ref} = utils.prm();
    loadMoreRows(80, 0, ref, backdrop)
      .then((data) => {
        if(data.error) {
          const err = new Error(data.message);
          if(data.status) {
            err.status = data.status;
          }
          throw err;
        }
        const {by_ref} = calc_order;
        for(const row of data.docs) {
          const tmp = by_ref[row.ref];
          if(tmp && !tmp.is_new()) {
            for(const fld in row) {
              row[fld] = tmp[fld];
            }
          }
        }
        setRows((rows) => {
          const nrows = [...rows, ...data.docs];
          if(ref) {
            if(nrows.find((raw) => raw.ref === ref)) {
              setTimeout(() => setSelectedRows(new Set([ref])));
            }
          }
          return nrows;
        });
      })
      .catch(setError);
  }, []);

  const [create, clone, open] = mgrCreate({mgr: calc_order, navigate, selectedRows, backdrop});

  const onCellClick = cellClick({selectedRows, setSelectedRows});

  const onCellKeyDown = cellKeyDown({
    rows,
    columns,
    create,
    clone,
    open,
    setSelectedRows
  });

  return <Content>
    <ListToolbar create={create} clone={clone} open={open} disabled={Boolean(error)}/>
    {error ? error.message : <DataGrid
      columns={columns}
      rows={rows}
      rowKeyGetter={rowKeyGetter}
      onRowsChange={setRows}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      onCellClick={onCellClick}
      onCellDoubleClick={open}
      onCellKeyDown={onCellKeyDown}
      className="fill-grid"
      rowHeight={33}
    />}
  </Content>;
}
