import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import {schemas, initScheme, setScheme} from './data';

export function RmdHead({handleIfaceState, rmd}) {

  const value = rmd?.scheme?.ref || initScheme;
  const handleChange = (event, ref) => setScheme(
    handleIfaceState, Object.assign({}, rmd, {scheme: $p.cat.scheme_settings.get(ref)}));

  return <>
    <Tabs value={value} onChange={handleChange}>
      {schemas.map((scheme) => <Tab key={scheme.ref} value={scheme.ref} label={scheme.name} />)}
    </Tabs>
  </>;
}
