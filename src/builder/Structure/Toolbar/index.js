import React from 'react';
import {Toolbar} from '../../../aggregate/App/styled';
import Indicator from './Indicator'
import RootToolbar from './Root';
import LayerToolbar from './Layer';
import ProfileToolbar from './Profile';
import FillingToolbar from './Filling';
import {useBuilderContext} from '../../Context';

export default function StructureToolbar () {
  const {editor, type, project, layer, elm, setContext} = useBuilderContext();
  let Buttons = RootToolbar;
  if(type === 'layer' && layer) {
    Buttons = LayerToolbar;
  }
  else if(type === 'elm' && elm) {
    Buttons = elm instanceof editor.Filling ? FillingToolbar : ProfileToolbar;
  }
  const props = {editor, project, layer, elm, type, setContext};
  return <Toolbar disableGutters>
    {Indicator(props)}
    {Buttons(props)}
  </Toolbar>;
}
