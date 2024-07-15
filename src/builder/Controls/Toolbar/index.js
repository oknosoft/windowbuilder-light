import React from 'react';
import {Toolbar} from '../../../aggregate/App/styled';
import Indicator from '../../Structure/Toolbar/Indicator';
import RootToolbar from './Root';

export default function ControlsToolbar (props) {

  let Buttons = RootToolbar;
  return <Toolbar disableGutters>
    {Indicator(props)}
    {Buttons(props)}
  </Toolbar>;
}
