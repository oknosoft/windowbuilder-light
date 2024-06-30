import React from 'react';
import {Toolbar} from '../../../aggregate/App/styled';

export default function RootToolbar({type}) {
  return <Toolbar disableGutters>{type}</Toolbar>
}
