import React from 'react';
import {Sticker} from './Sticker';
import {StickerCut} from './StickerCut';

export function Stickers40({print, obj, attr, skipCss, externalWindow, cssName}) {
  skipCss();
  const [[rows, cuts], setRows] = React.useState([[], []]);

  React.useEffect(() => {
    const {document} = externalWindow;
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `/imgs/${cssName || 'stickers40'}.css`;
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
        rows.sort($p.utils.sort(['obj', 'obj', 'imaterial', 'name']));
        const cuts = [];
        obj.cuts.find_rows({record_kind: 'Расход'}, row => {
          cuts.push(row);
        });
        setRows([rows, cuts]);
      })
      .then(() => {
        setTimeout(print, 100);
      });
  }, []);


  return rows.length ?
    rows.map((row, index) => <Sticker key={`r-${index}`} row={row} cssName={cssName} />)
      .concat(cuts.map((row, index) => <StickerCut key={`r-${index}`} row={row} cssName={cssName} />)) :
    <div>Загрузка стилей</div>;
}

Stickers40.ref = '7cd91420-8440-11f0-b163-cf4cf985f90e';
Stickers40.destination = 'doc.work_centers_task';
Stickers40.title = 'Этикетки 40';
Stickers40.jsx = true;
