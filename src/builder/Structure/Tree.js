
import React from 'react';
import {Treebeard, decorators, filters} from '@oknosoft/ui/Treebeard';
import getStruct from './getStruct';

export default function StructureTree() {

  const struct = getStruct({});

  return <div className="dsn-tree" ref={node => null}>
    <Treebeard
      data={struct}
      decorators={decorators}
      separateToggleEvent={true}
      onToggle={null}
      onClickHeader={null}
      onRightClickHeader={null}
    />
  </div>;
}
