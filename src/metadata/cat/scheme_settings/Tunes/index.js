import React from 'react';
import Tabs from './Tabs';
import Columns from './Columns';
import Selection from './Selection';
import Sorting from './Sorting';
import Grouping from './Grouping';

export default function SchemeSettingsTunes({obj}) {
  const [tab, setTab] = React.useState("selection");
  const tabRef = React.useRef(null);
  return <>
    <Tabs ref={tabRef} obj={obj} tab={tab} setTab={setTab}/>
    {tab === 'columns' && <Columns obj={obj} tabRef={tabRef}/>}
    {tab === 'selection' && <Selection obj={obj} tabRef={tabRef}/>}
    {tab === 'sorting' && <Sorting obj={obj} tabRef={tabRef}/>}
    {tab === 'grouping' && <Grouping obj={obj} tabRef={tabRef}/>}
  </>;
}
