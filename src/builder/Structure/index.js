import React from 'react';
import structureToolbar from './Toolbar';
import StructureTree from './Tree';
import './styles/designer.css';

export default function ProductStructure() {
  const Toolbar = structureToolbar();
  return <>
    <Toolbar />
    <StructureTree />
  </>;
}
