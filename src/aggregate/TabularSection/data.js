
export function handlers({obj, ts, rows, setRows, getRow, setBackdrop, setModified, setSnack, selectedRowsChange}) {

  const {job_prm, utils, doc: {calc_order}} = $p;

  const add = async (proto, noBackdrop) => {

  };

  const create = () => add();

  const clone = () => {
    const row = getRow();
    return add(row?.row?.characteristic);
  };

  const del = async () => {
    const row = getRow();
    if(row) {
      obj[ts].del(row);
      rows.splice(rows.indexOf(row), 1);
      setRows([...rows]);
      setBackdrop(false);
    }
    else {
      setSnack('Укажите строку табчасти для удаления');
    }
  };

  const clear = async () => {
    obj[ts].clear();
    await selectedRowsChange(new Set(), true);
    setRows([]);
    setBackdrop(false);
  };



  return {add: create, clone, del, clear};

}
