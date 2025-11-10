import React from 'react';
import Typography from '@mui/material/Typography';
import {initScheme, barcodeState} from './data';
const {cat: {scheme_settings}, doc: {planning_event}, ui: {dialogs}} = $p;

const prev = {barcode: ''};

const doRemake = (rows, barcode, handleIfaceState, setBackdrop) => {
  let base;
  for(const tmp of rows) {
    if(tmp.register_type === 'doc.work_centers_task') {
      if(!base || tmp.period > base.period) {
        base = tmp;
      }
    }
  }
  if(base) {
    const row = base.register.set.find({record_kind: -1, obj: base.planing_key});
    const ev = planning_event.create({basis: base.register.valueOf()}, false, true);
    const correct = ev.set.add(row);
    correct.record_kind = 1;
    correct.date = new Date();
    correct.part = ev;
    return ev.save(true)
      .then(() => {
        barcodeState.control(barcode, handleIfaceState, setBackdrop, true)
      })
      .catch((err) => dialogs.alert({title: 'Переделка', text: err?.message || err}));
  }
  dialogs.alert({title: 'Переделка', text: 'Ошибка штрихкода', timeout: 3000});
}

function Remake({paperless, handleIfaceState, setBackdrop}) {
  const {barcode, stamp, characteristic, rows} = paperless;
  const [wait, setWait] = React.useState(0);
  if(wait) {
    if(prev.timer) {
      clearTimeout(prev.timer);
    }
    prev.timer = setTimeout(() => setWait((v) => v ? v - 1 : 0), 1000);
  }
  React.useEffect(() => {
    if(wait && characteristic && prev.barcode === barcode) {
      setWait(0);
      prev.barcode = '';
      doRemake(rows, barcode, handleIfaceState, setBackdrop);
      return;
    }
    prev.barcode = barcode;
    setWait(8);
  }, [stamp]);

  return wait ? <Typography variant="h6">Чтобы отправить изделие на переделку, просканируйте этикетку повторно в течение {wait} секунд</Typography> : null;
}

export default function RemakeCond({paperless, handleIfaceState, setBackdrop}) {
  const scheme = paperless?.scheme || scheme_settings.get(initScheme);
  return scheme.params.find({param: 'remake'}) ? <Remake paperless={paperless} handleIfaceState={handleIfaceState} setBackdrop={setBackdrop}/> : null;
}
