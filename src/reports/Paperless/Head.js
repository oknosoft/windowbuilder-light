import React from 'react';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GoTo from '../../aggregate/App/GoTo';
import Barcode from './Barcode';

import {schemas, initScheme, setScheme} from './data';

export default function PaperlessHead({handleIfaceState, paperless}) {

  const tab = paperless?.scheme?.ref || initScheme;
  const handleTabChange = (event, ref) => setScheme(handleIfaceState, paperless, ref);

  return <>
    <Tabs value={tab} onChange={handleTabChange}>
      {schemas.map((scheme) => <Tab key={scheme.ref} value={scheme.ref} label={scheme.name} />)}
    </Tabs>
    <Typography sx={{flex: 1}}></Typography>
    <Barcode handleIfaceState={handleIfaceState} paperless={paperless} />
    <GoTo items={[
      {name: 'Расчёты-заказы', path: '/doc/calc_order'},
      {name: 'Список заданий', path: '/doc/work_centers_task'},
      {name: 'Уточнения планов', path: '/doc/planning_event'},
    ]}/>
  </>;
}

