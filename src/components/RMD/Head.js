import React from 'react';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GoTo from '../App/GoTo';

import {schemas, initScheme, setScheme} from './data';

export function RmdHead({handleIfaceState, rmd}) {

  const value = rmd?.scheme?.ref || initScheme;
  const handleChange = (event, ref) => setScheme(handleIfaceState, rmd, ref);

  return <>
    <Tabs value={value} onChange={handleChange}>
      {schemas.map((scheme) => <Tab key={scheme.ref} value={scheme.ref} label={scheme.name} />)}
    </Tabs>
    <Typography sx={{flex: 1}}></Typography>
    <GoTo items={[
      {name: 'Расчёты-заказы', path: '/doc/calc_order'},
      {name: 'Текущее задание', path: `/doc/work_centers_task/${rmd?.tgt?.ref}?return=/rmd&modified=false`},
      {name: 'Список заданий', path: '/doc/work_centers_task'},
    ]}/>
  </>;
}
