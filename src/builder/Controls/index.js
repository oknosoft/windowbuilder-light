import React from 'react';
import ControlsTabs from './Tabs';

import {useBuilderContext} from '../Context';


export default function Controls() {
  const {editor, tool, type, project, layer, elm, node, stamp, setContext} = useBuilderContext();
  const [tab, rawSetTab] = React.useState('elm');
  const setTab = React.useMemo(() => $p.utils.debounce(rawSetTab), []);
  const props = {editor, tool, type, project, layer, elm, node, stamp, setContext, tab, setTab};

  return <ControlsTabs {...props}/>;
}
