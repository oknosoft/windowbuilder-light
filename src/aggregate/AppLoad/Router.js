import React from 'react';
import {Routes, Route} from 'react-router';
import {useLoadingContext} from '../Metadata';
import {Wraper} from '../App/Wraper';

const loginRoute = Wraper(React.lazy(() => import('../FrmLogin')));
const catRoute = Wraper(React.lazy(() => import('../../catalogs/Router')));
const docRoute = Wraper(React.lazy(() => import('../../documents/Router')));
const scheduler = Wraper(React.lazy(() => import('../../reports/Scheduler/Stub')));
const rmd = Wraper(React.lazy(() => import('../../reports/RMD')));

export default function DataRoute() {
  const {ifaceState: {complete_loaded}} = useLoadingContext();
  return complete_loaded ? <Routes>
    <Route path="doc/*" element={docRoute}/>
    <Route path="cat/*" element={catRoute} />
    <Route path="cch/*" element={catRoute} />
    <Route path="scheduler/*" element={scheduler} />
    <Route path="rmd/*" element={rmd} />
  </Routes> : loginRoute;
}
