import React from 'react';
import {useNavigate} from 'react-router';
import IconButton from '@mui/material/IconButton';
import RepartitionIcon from '@mui/icons-material/Repartition';
import {HtmlTooltip} from '../../aggregate/App/styled';
import {planById} from './PlanDetales';

export function repartition({obj, selected, noRow, fin}) {
  if(selected.rows?.size) {
    const tmp = obj.cutting.find({row: Array.from(selected.rows)[0]});
    const row = tmp && obj.set.find({record_kind: -1, obj: tmp.obj});
    if(row) {
      return planById(tmp.obj.id)
        .then(() => {
          const ev = $p.doc.planning_event.create({basis: obj.valueOf()}, false, true);
          const correct = ev.set.add(row);
          correct.record_kind = 1;
          correct.date = new Date();
          correct.part = ev;
          return ev.save(true);
        })
        // штатно, в fin передеём navigate, но можем подмешать и другие действия
        .then(() => fin(`/doc/planning_event/${ev.ref}?return=-1`))
        .catch(console.error);
    }
  }
  else {
    noRow();
  }
}

export default function Repartition({obj, selected, noRow}) {
  const fin = useNavigate();
  return <HtmlTooltip title="Оформить переделку">
    <IconButton onClick={() => repartition({obj, selected, noRow, fin})}><RepartitionIcon/></IconButton>
  </HtmlTooltip>;
}
