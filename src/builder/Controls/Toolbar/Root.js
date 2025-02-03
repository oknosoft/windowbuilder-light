import React from 'react';
import Box from '@mui/material/Box';
import InsetSelection from './InsetSelection';
import {SpecificationsButton} from '../../../catalogs/specifications/FrmObj';

export default function RootToolbar(props) {
  return <>
    <InsetSelection {...props} />
    <Box sx={{flex: 1}} />
    <SpecificationsButton project={props.project}/>
  </>;
}
