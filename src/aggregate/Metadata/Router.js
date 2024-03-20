import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {useLoadingContext} from './index';
import {Wraper} from '../App/Wraper';

const FrmLogin = React.lazy(() => import('../FrmLogin'));
const CatRouter = React.lazy(() => import('../../catalogs/Router'));
const DocRouter = React.lazy(() => import('../../documents/Router'));
const loginRoute = Wraper(FrmLogin);
const catRoute = Wraper(CatRouter);
const docRoute = Wraper(DocRouter);

export default function DataRoute() {
  const {ifaceState: {complete_loaded}} = useLoadingContext();
  return complete_loaded ? <Routes>
    <Route path="doc/*" element={docRoute}/>
    <Route path="cat/*" element={catRoute} />
    <Route path="cch/*" element={catRoute} />
  </Routes> : loginRoute;
}