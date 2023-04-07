import React from 'react';
import {Routes, Route} from 'react-router-dom';
import DataList from '../../packages/ui/DataList';

export default function DataRoute() {
  return <Routes>
    <Route path="*" element=<DataList /> />
  </Routes>;
}
