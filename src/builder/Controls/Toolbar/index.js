import React from 'react';
import {Toolbar} from '../../../aggregate/App/styled';
import Indicator from '../../Structure/Toolbar/Indicator';
import RootToolbar from './Root';
import ProfileToolbar from './Profile';

export default function controlsToolbar (props) {
  let {type, tab, editor, elm, layer} = props;
  if(type === 'settings' || !editor) {
    tab = 'settings';
  }
  else if(tab === 'elm' && type === 'node') {
    tab = 'node';
  }
  else if((tab === 'elm' && !elm) || (tab === 'layer' && !layer)) {
    tab = 'root';
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
