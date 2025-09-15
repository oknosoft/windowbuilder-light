import {PlanDetales} from '../PlanDetales';

export function PlaningDates(task, {adapters, ui, doc}) {
  return adapters.pouch
    .fetch(`/adm/api/dates/keys?keys=${task.set.unload_column('obj').map(v => v.id).join(',')}`)
    .then(res => res.json())
    .then((rows) => {
      return ui.dialogs.alert({
        title: `Записи по '${task.toString()}'`,
        Component: PlanDetales,
        props: {rows},
        initFullScreen: true,
        large: true,
        timeout: 10e6,
      });
    });
}

PlaningDates.ref = '2e961c80-921a-11f0-98e5-0d31d581c215';
PlaningDates.destination = 'doc.work_centers_task';
PlaningDates.title = 'Даты планирования';
PlaningDates.jsx = false;
