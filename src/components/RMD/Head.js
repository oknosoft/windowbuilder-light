import React from 'react';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GoTo from '../App/GoTo';

import {schemas, initScheme, setScheme} from './data';

export function RmdHead({handleIfaceState, rmd}) {

  const value = rmd?.scheme?.ref || initScheme;
  const handleChange = (event, ref) => setScheme(
    handleIfaceState, Object.assign({}, rmd, {scheme: $p.cat.scheme_settings.get(ref)}));

  return <>
    <Tabs value={value} onChange={handleChange}>
      {schemas.map((scheme) => <Tab key={scheme.ref} value={scheme.ref} label={scheme.name} />)}
    </Tabs>
    <Typography sx={{flex: 1}}></Typography>
    <GoTo items={[{name: 'Расчёты-заказы', path: '/doc/calc_order'}]}/>
  </>;
}
