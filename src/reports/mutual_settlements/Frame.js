import React from 'react';
import Grid from './Grid';

function getRows() {
  return adapters.pouch
    .fetch(`/adm/api/dates/keys?order=${order.ref}`)
    .then(res => res.json())
    .then((rows) => {
      const fakeTask = doc.work_centers_task.create({}, false, true)._set_loaded();
      for(const raw of rows) {
        const row = fakeTask.set.add({
          calc_order: raw.calc_order,
          date: raw.date,
          obj: raw.ref,
          part: raw.part,
          phase: raw.phase,
          power: parseFloat(raw.power),
          record_kind: raw.record_kind,
          stage: raw.stage,
          work_center: raw.work_center,
          work_shift: raw.work_shift,
        }, true, null, true);
      }
      return fakeTask.load_keys()
        .then(() => {
          fakeTask.unload();
          return rows;
        });
    })
    .then((rows) => {
      return ui.dialogs.alert({
        title: `Взаиморасчёты с контрагентом '${order.toString()}'`,
        Component: PlanDetales,
        props: {rows},
        initFullScreen: true,
        large: true,
        timeout: 10e6,
      });
    });
}

const {rep: {mutual_settlements}, adapters: {pouch}, utils: {moment}} = $p;
const dp = mutual_settlements.create();

export default function SettlementsFrame({partner}) {

  const [rows, setRows] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {

  }, [partner]);

  return error ? (error.message || error) : <Grid rows={rows}/>;
}
