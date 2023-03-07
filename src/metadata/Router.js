import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {useLoadingContext} from '../components/Metadata';
import FrmLogin from '../components/FrmLogin';
import CatRouter from './cat/Router';
import DocRouter from './doc/Router';

export default function DataRoute() {
  const {ifaceState: {complete_loaded}} = useLoadingContext();
  return complete_loaded ? <Routes>
    <Route path="doc/*" element={<DocRouter />}/>
    <Route path="cat/*" element={<CatRouter />} />
  </Routes> : <FrmLogin/>;
}
