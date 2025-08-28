import React from 'react';
import {Sticker} from './Sticker';

export function Stickers({print, obj, attr, skipCss, externalWindow}) {
  skipCss();
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const {document} = externalWindow;
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = '/imgs/stickers.css';
    document.getElementsByTagName('head')[0].appendChild(link);

    $p.utils.loadQR().then(() => {
      let queue = Promise.resolve();
      for(const row of obj.set) {
        if(row.obj?.id) {
          queue = queue
            .then(() => QRCode.toString(row.obj.id.toFixed(), {type: 'svg'}))
            .then((svg) => row.svg = svg);
        }
      }
      return queue;
    })
      .then(() => {
        const rows = [];
        for(const row of obj.set) {
          if(row.obj?.id) {
            rows.push(row);
          }
        }
        setRows(rows);
      })
      .then(() => {
        setTimeout(print, 100);
      });
  }, []);


  return rows.length ?
    rows.map((row, index) => <Sticker key={`r-${index}`} row={row} />) :
    <div>Загрузка стилей</div>;
}

Stickers.ref = '7cd91420-8440-11f0-b163-cf4cf985f90e';
Stickers.destination = 'doc.work_centers_task';
Stickers.title = 'Этикетки';
