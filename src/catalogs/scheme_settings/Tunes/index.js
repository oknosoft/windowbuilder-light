import React from 'react';
import Tabs from './Tabs';
import Columns from './Columns';
import Selection from './Selection';
import Sorting from './Sorting';
import Grouping from './Grouping';

function Stub() {
  return 'не реализовано';
}

function component(tab, tabs) {
  const Component = tabs?.[tab];
  if(!Component) {
    switch (tab) {
      case 'columns':
        return Columns;
      case 'selection':
        return Selection;
      case 'sorting':
        return Sorting;
      case 'grouping':
        return Grouping;
    }
  }
  return Component || Stub;
}

export default function SchemeSettingsTunes({obj, tabs}) {
  const [tab, setTab] = React.useState("params");
  const tabRef = React.useRef(null);
  const Component = component(tab, tabs);
  return <>
    <Tabs ref={tabRef} obj={obj} tab={tab} setTab={setTab}/>
    <Component obj={obj} tabRef={tabRef}/>
  </>;
}
