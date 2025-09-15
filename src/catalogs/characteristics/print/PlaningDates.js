import {PlanDetales} from '../../../documents/work_centers_task/PlanDetales';

export function PlaningDates(product, {adapters, ui, doc}) {
  return adapters.pouch
    .fetch(`/adm/api/dates/keys?product=${product.ref}`)
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
        title: `Записи по '${product.toString()}'`,
        Component: PlanDetales,
        props: {rows},
        initFullScreen: true,
        large: true,
        timeout: 10e6,
      });
    });
}

PlaningDates.ref = '3a049630-9230-11f0-9822-95646486ed6e';
PlaningDates.destination = 'cat.characteristics';
PlaningDates.title = 'Даты планирования';
PlaningDates.jsx = false;
