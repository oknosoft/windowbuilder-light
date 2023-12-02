import React from 'react';
import Typography from '@mui/material/Typography';
import DataGrid from 'react-data-grid';
import {useNavigate} from 'react-router-dom';
import {Content} from '../../../components/App/styled';
import {useTitleContext, useBackdropContext} from '../../../components/App';
import ListToolbar from '../../_common/ListToolbar';
import {rowKeyGetter, cellClick, cellKeyDown, mgrCreate, isAtBottom} from '../../dataGrid';


const {adapters: {pouch}, cat: {scheme_settings}, doc: {work_centers_task}, utils} = $p;
const scheme = scheme_settings
  .find_schemas('doc.work_centers_task', true)
  .find(({name}) => name.endsWith('.main'));
const {fields} = work_centers_task.metadata();
const columns = scheme.rx_columns({mode: 'ts', fields, _mgr: work_centers_task});

const listName = 'Задания на производство (список)';
const title =  {title: listName, appTitle: <Typography variant="h6" noWrap>{listName}</Typography>};

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

  return work_centers_task.find_rows_remote(selector)
    .then((res) => {
      backdrop.setBackdrop(false);
      return res;
    })
    .catch((err) => {
      backdrop.setBackdrop(false);
      throw err;
    });
}

export default function WorkCentersTaskList() {
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
    loadMoreRows(300, 0, ref, backdrop)
      .then((data) => {
        setRows((rows) => {
          const nrows = [...rows, ...data];
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

  const [create, clone, open] = mgrCreate({mgr: work_centers_task, navigate, selectedRows, backdrop});

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
    <ListToolbar create={create} clone={null} open={open} disabled={Boolean(error)}/>
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
