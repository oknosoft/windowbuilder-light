import React from 'react';
import Box from '@mui/material/Box';
import ButtonImitation from './ProfileImitation';
import InsetSelection from './InsetSelection';
import {SpecificationsButton} from '../../../catalogs/specifications/FrmObj';


export default function ProfileToolbar(props) {
  return <>
    <ButtonImitation {...props} />
    <InsetSelection {...props} />
    <Box sx={{flex: 1}} />
    <SpecificationsButton project={props.project} selm={props.elm?.index}/>
  </>;
}
