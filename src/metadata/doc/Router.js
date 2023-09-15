import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Loading from '../../components/App/Loading';
import CalcOrderList from './calc_order/List';
import CalcOrderObj from './calc_order/Obj';
const WorkCentersTaskList = React.lazy(() => import('./work_centers_task/List'));
const WorkCentersTaskObj = React.lazy(() => import('./work_centers_task/Obj'));

export default function DataRoute() {
  return <React.Suspense fallback={<Loading/>}>
      <Routes>
      <Route path="calc_order">
        <Route index element={<CalcOrderList />} />
        <Route path=":ref" element={<CalcOrderObj />} />
      </Route>
      <Route path="work_centers_task">
        <Route index element={<WorkCentersTaskList />} />
        <Route path=":ref" element={<WorkCentersTaskObj />} />
      </Route>
      <Route path="*" element="not found" />
      </Routes>
    </React.Suspense>;
}
