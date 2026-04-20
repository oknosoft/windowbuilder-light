import React from 'react';
import {Cut2DSheet} from './Cut2DSheet';
import {materialSort} from './CutsBalance'

export function Cut2D({print, obj, attr, skipCss, externalWindow}) {
  skipCss();
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const {document} = externalWindow;
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `/imgs/cut2d.css`;
    document.getElementsByTagName('head')[0].appendChild(link);

    setTimeout(() => {
      const rows = [];
      const {cuts, cutting} = obj;
      const record_kind = $p.enm.debit_credit_kinds.debit;
      for(const row of cuts) {
        if(row.record_kind === record_kind && row.width && row.len && cutting.find({stick: row.stick})) {
          rows.push(row);
        }
      }
      rows.sort(materialSort);
      setRows(rows);
      setTimeout(print, 100);
    }, 100);


  }, []);


  return rows.length ?
    rows.map((row, index) => <Cut2DSheet key={`r-${index}`} obj={obj} row={row}/>) :
    <div>Загрузка стилей</div>;
}

Cut2D.ref = '019cd3d3-7654-70e9-853c-ba9c90a58fbe';
Cut2D.destination = 'doc.work_centers_task';
Cut2D.title = 'Раскрой 2D';
Cut2D.jsx = true;
Cut2D.allowModified = true;
