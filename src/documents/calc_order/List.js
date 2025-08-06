import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {DataGrid} from 'react-data-grid';
import {useNavigate} from 'react-router';
import {Content} from '../../aggregate/App/styled';
import GoTo from '../../aggregate/App/GoTo';
import {useTitleContext, useBackdropContext} from '../../aggregate/App';
import Toolbar from '../../aggregate/Toolbars/ListToolbar';
import Selection from '../../catalogs/scheme_settings/Selection';
import {rowKeyGetter, cellClick, cellKeyDown, mgrCreate, isAtBottom} from '../../aggregate/AppLoad/dataGrid';


const {adapters: {pouch}, cat: {scheme_settings}, doc: {calc_order}, utils, wsql} = $p;
const scheme = scheme_settings
  .find_schemas('doc.calc_order', true)
  .find(({name}) => name.endsWith('.main'));
const {fields} = calc_order.metadata();
const presentationsMap = {};
const represents = wsql.get_user_param('defferd_partners', 'boolean');
const columns = scheme.rx_columns({
  mode: 'ts',
  fields,
  _mgr: calc_order,
  presentations: represents ? presentationsMap : null});

const listName = 'Расчёты-заказы (список)';
const title =  {
  title: listName,
  appTitle: <>
    <Typography variant="h6" sx={{flex: 1}} noWrap>{listName}</Typography>
    <GoTo items={[
      {name: 'РМД', path: '/rmd'},
      {name: 'Задания на производство', path: '/doc/work_centers_task'},
    ]}/>
  </>};

function loadMoreRows(newRowsCount, skip, ref, backdrop) {

  backdrop.setBackdrop(true);

  const sprm = {
    columns,
    skip,
    limit: newRowsCount,
    _owner: null,
  };

  const selector = scheme.mango_selector(sprm);
  scheme.append_selection(selector);
  if(ref) {
    selector.ref = ref;
  }
  if(represents) {
    selector.represents = true;
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
    .then(({presentations, ...res}) => {
      if(presentations) {
        Object.assign(presentationsMap, presentations);
      }
      if(ref) {
        res.ref = ref;
      }
      return res;
    })
    .catch((err) => {
      backdrop.setBackdrop(false);
      throw err;
    });
}

export default function CalcOrderList() {
  const [rows, setRows] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState(new Set());
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [refresh, rawSetRefresh] = React.useState(0);
  const navigate = useNavigate();
  const backdrop = useBackdropContext();
  const {setTitle} = useTitleContext();
  const gridRef = React.useRef(null);

  // для обновления динсписка
  const setRefresh = () => {
    setLoading(true);
    setSelectedRows(new Set());
    setRows([]);
    rawSetRefresh(refresh + 1);
  };

  const moreRowsFin = (data) => {
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
      if(data.ref) {
        const selectedRow = nrows.find(({ref}) => ref === data.ref);
        if(selectedRow) {
          setTimeout(() => {
            setSelectedRows(new Set([data.ref]));
            const {current} = gridRef;
            if(current) {
              const pos = {idx: 0, rowIdx: nrows.indexOf(selectedRow)};
              current.scrollToCell(pos);
              current.selectCell(pos);
            }
          });
        }
      }
      return nrows;
    });
    setLoading(false);
  };
  const moreRowsError = (err) => {
    setLoading(false);
    setError(err);
  }

  React.useEffect(() => {
    setTitle(title);
    const {ref} = utils.prm();
    rows.length = 0;
    loadMoreRows(600, 0, ref, backdrop)
      .then(moreRowsFin)
      .catch(moreRowsError);
  }, [refresh]);

  const [create, clone, open, open1C] = mgrCreate({mgr: calc_order, navigate, selectedRows, rows, backdrop});

  const onCellClick = cellClick({selectedRows, setSelectedRows});

  const onCellKeyDown = cellKeyDown({
    rows,
    columns,
    create,
    clone,
    open,
    setSelectedRows
  });

  const handleScroll = (event) => {
    if (isLoading || !isAtBottom(event)) return;

    setLoading(true);

    loadMoreRows(300, rows.length, null, backdrop)
      .then(moreRowsFin)
      .catch(moreRowsError);

  };

  return <Content>
    <Toolbar create={create} clone={clone} open={open} open1C={open1C} disabled={Boolean(error)} scheme={scheme} setRefresh={setRefresh}/>
    {error ? error.message :
      <Grid container spacing={0}>
    <Grid size={{xs: 12, md: 10}} style={{height: `calc(100vh - 101px)`}}>
      <DataGrid
        ref={gridRef}
        columns={columns}
        rows={rows}
        rowKeyGetter={rowKeyGetter}
        onRowsChange={setRows}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        onCellClick={onCellClick}
        onCellDoubleClick={open}
        onCellKeyDown={onCellKeyDown}
        onScroll={handleScroll}
        className="fill-grid"
        rowHeight={33}
      />
    </Grid>
    <Grid size={{xs: 0, md: 2}}>
      <Selection scheme={scheme} setRefresh={setRefresh}/>
    </Grid>
  </Grid>

      }
  </Content>;
}
