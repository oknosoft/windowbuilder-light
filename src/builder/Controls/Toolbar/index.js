import React from 'react';
import {Toolbar} from '../../../aggregate/App/styled';
import Indicator from '../../Structure/Toolbar/Indicator';
import RootToolbar from './Root';
import ProfileToolbar from './Profile';
import FillingToolbar from './Filling';

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
    case 'elm': {
      if(Array.isArray(elm)) {

      }
      else if(elm?.is('GeneratrixElement')) {
        Buttons = ProfileToolbar;
      }
      else if(elm?.is('Filling')) {
        Buttons = FillingToolbar;
      }
      break;
    }
  }
  return <Toolbar disableGutters>
    {Indicator(props)}
    {Buttons(props)}
  </Toolbar>;
}
