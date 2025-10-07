import React from 'react';
import Typography from '@mui/material/Typography';
import {DataGrid} from 'react-data-grid';
import {useNavigate} from 'react-router';
import {Content} from '../../aggregate/App/styled';
import GoTo from '../../aggregate/App/GoTo';
import {useTitleContext, useBackdropContext} from '../../aggregate/App';
import ListToolbar from '../../aggregate/Toolbars/ListToolbar';
import {rowKeyGetter, cellClick, cellKeyDown, mgrCreate, isAtBottom} from '../../aggregate/AppLoad/dataGrid';


const {adapters: {pouch}, cat: {scheme_settings}, doc: {planning_event}, utils} = $p;
const scheme = scheme_settings
  .find_schemas('doc.planning_event', true)
  .find(({name}) => name.endsWith('.main'));
const {fields} = planning_event.metadata();
const columns = scheme.rx_columns({mode: 'ts', fields, _mgr: planning_event});

const listName = 'Уточнения планов и диспетчеризация';
const title =  {title: listName, appTitle: <>
    <Typography variant="h6" sx={{flex: 1}} noWrap>{listName}</Typography>
    <GoTo items={[
      {name: 'РМД', path: '/rmd'},
      {name: 'Расчёты-заказы', path: '/doc/calc_order'},
      {name: 'Задания на производство', path: '/doc/work_centers_task'},
      {name: 'Безбумажка', path: '/paperless'},
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
  selector._raw = true;

  return planning_event.find_rows_remote(selector)
    .then((res) => {
      backdrop.setBackdrop(false);
      return res;
    })
    .catch((err) => {
      backdrop.setBackdrop(false);
      throw err;
    });
}

export default function PlanningEventList() {
  const [rows, setRows] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState(new Set());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [refresh, rawSetRefresh] = React.useState(0);
  const navigate = useNavigate();
  const backdrop = useBackdropContext();
  const {setTitle} = useTitleContext();
  const prms = React.useMemo(() => utils.prm(), []);

  // для обновления динсписка
  const setRefresh = () => {
    setSelectedRows(new Set());
    setRows([]);
    rawSetRefresh(refresh + 1);
  };

  React.useEffect(() => {
    setTitle(title);
    loadMoreRows(300, 0, prms.ref, backdrop)
      .then((data) => {
        setRows((rows) => {
          const nrows = [...rows, ...data];
          if(prms.ref) {
            if(nrows.find((raw) => raw.ref === prms.ref)) {
              setTimeout(() => setSelectedRows(new Set([prms.ref])));
            }
          }
          return nrows;
        });
      })
      .catch(setError);
  }, [refresh]);

  const [create, clone, open] = mgrCreate({mgr: planning_event, navigate, selectedRows, rows, backdrop, prms});

  const onCellClick = cellClick({selectedRows, setSelectedRows});

  const onCellKeyDown = cellKeyDown({
    rows,
    columns,
    create,
    clone: null,
    open,
    setSelectedRows
  });

  return <Content>
    <ListToolbar create={create} clone={null} open={open} disabled={Boolean(error)} scheme={scheme} setRefresh={setRefresh} prms={prms}/>
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
