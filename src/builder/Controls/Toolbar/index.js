import React from 'react';
import {Toolbar} from '../../../aggregate/App/styled';
import Indicator from '../../Structure/Toolbar/Indicator';
import RootToolbar from './Root';
import ProfileToolbar from './Profile';

export default function controlsToolbar (props) {
  let {type, tab, editor} = props;
  if(type === 'settings' || !editor) {
    tab = 'settings';
  }
  else if(tab === 'elm' && type === 'node') {
    tab = 'node';
  }
  let Buttons = RootToolbar;
  switch (tab) {
    case 'elm':
      Buttons = ProfileToolbar;
      break;
  }
  return <Toolbar disableGutters>
    {Indicator(props)}
    {Buttons(props)}
  </Toolbar>;
}
