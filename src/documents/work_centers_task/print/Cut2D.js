import React from 'react';
import {Cut2DSheet} from './Cut2DSheet';

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

    Promise.resolve().then(() => {
      const rows = [];
      const {cuts, cutting} = obj;
      for(const row of cuts) {
        if(row.width && row.len && cutting.find({stick: row.stick})) {
          rows.push(row);
        }
      }
      setRows(rows);
      //setTimeout(print, 100);
    });

  }, []);


  return rows.length ?
    rows.map((row, index) => <Cut2DSheet key={`r-${index}`} row={row} />) :
    <div>Загрузка стилей</div>;
}

Cut2D.ref = '019cd3d3-7654-70e9-853c-ba9c90a58fbe';
Cut2D.destination = 'doc.work_centers_task';
Cut2D.title = 'Раскрой 2D';
Cut2D.jsx = true;
