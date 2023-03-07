import React from 'react';
import {Routes, Route} from 'react-router-dom';
import CalcOrderList from './calc_order/List';
import CalcOrderObj from './calc_order/Obj';

export default function DataRoute() {
  return <Routes>
    <Route path="calc_order">
      <Route index element={<CalcOrderList />} />
      <Route path=":ref" element={<CalcOrderObj />} />
    </Route>
    <Route path="*" element="not found" />
  </Routes>;
}
