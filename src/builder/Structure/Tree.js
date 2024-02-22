
import React from 'react';
import {Treebeard, decorators, filters} from '@oknosoft/ui/Treebeard';
import getStruct from './getStruct';
import {useBuilderContext} from '../Context';


export default function StructureTree() {
  const {editor, stamp} = useBuilderContext();
  const struct = React.useMemo(() => {
    return editor?.project ? getStruct(editor.project) : null;
  }, [stamp]);

  if(!struct) {
    return 'Загрузка...';
  }

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
