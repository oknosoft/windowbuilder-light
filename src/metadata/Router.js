import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {useLoadingContext} from '../components/Metadata';
import {Wraper} from '../components/App/Wraper';

const loginRoute = Wraper(React.lazy(() => import('../components/FrmLogin')));
const catRoute = Wraper(React.lazy(() => import('./cat/Router')));
const docRoute = Wraper(React.lazy(() => import('./doc/Router')));
const scheduler = Wraper(React.lazy(() => import('../components/Scheduler/Stub')));
const rmd = Wraper(React.lazy(() => import('../components/RMD')));

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
