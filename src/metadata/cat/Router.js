import React from 'react';
import {Routes, Route} from 'react-router-dom';


export default function DataRoute() {
  return <Routes>
    <Route path="*" element="not found" />
  </Routes>;
}
