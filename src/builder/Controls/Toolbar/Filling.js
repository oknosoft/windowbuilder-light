import React from 'react';
import Box from '@mui/material/Box';
import InsetSelection from './InsetSelection';
import {SpecificationsButton} from '../../../catalogs/specifications/FrmObj';


export default function FillingToolbar(props) {
  return <>
    <InsetSelection {...props} />
    <Box sx={{flex: 1}} />
    <SpecificationsButton project={props.project} selm={props.elm?.index}/>
  </>;
}
