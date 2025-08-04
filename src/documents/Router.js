import React from 'react';
import {Routes, Route} from 'react-router';
import Loading from '../aggregate/App/Loading';
import CalcOrderList from './calc_order/List';
import CalcOrderObj from './calc_order/Obj';
const WorkCentersTaskList = React.lazy(() => import('./work_centers_task/List'));
const WorkCentersTaskObj = React.lazy(() => import('./work_centers_task/Obj'));
const PlanningEventList = React.lazy(() => import('./planning_event/List'));
const PlanningEventObj = React.lazy(() => import('./planning_event/Obj'));

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
      <Route path="planning_event">
        <Route index element={<PlanningEventList />} />
        <Route path=":ref" element={<PlanningEventObj />} />
      </Route>
      <Route path="*" element="not found" />
      </Routes>
    </React.Suspense>;
}
