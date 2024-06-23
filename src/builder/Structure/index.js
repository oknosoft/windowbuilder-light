import React from 'react';
import StructureToolbar from './Toolbar';
import StructureTree from './Tree';
import './styles/designer.css';

export default function ProductStructure() {
  return <>
    <StructureToolbar />
    <StructureTree />
  </>;
}
