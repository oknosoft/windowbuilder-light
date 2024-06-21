
import React from 'react';
import {Treebeard, decorators, filters} from '@oknosoft/ui/Treebeard';
import getStruct from './getStruct';
import {useBuilderContext} from '../Context';


export default function StructureTree() {
  const {editor, stamp, setContext} = useBuilderContext();
  const struct = React.useMemo(() => {
    return editor ? getStruct(editor) : null;
  }, [stamp]);
  const [index, setIndex] = React.useState(0);

  if(!struct) {
    return 'Загрузка...';
  }

  const onClickHeader = (node) => {
    if(node.type === 'product') {
      struct.deselect();
      editor.project.deselectAll();
      const project = node._owner;
      project.activate();
      editor.refreshTools();
      setContext({stamp: project.props.stamp, tool: editor.tool});
    }
  };

  const onToggle = (node, toggled) => {
    if (node.children) {
      node.toggled = toggled;
      setIndex(index + 1);
    }
  };

  return <div className="dsn-tree" ref={node => null}>
    <Treebeard
      data={struct}
      decorators={decorators}
      separateToggleEvent={true}
      onToggle={onToggle}
      onClickHeader={onClickHeader}
      onRightClickHeader={null}
    />
  </div>;
}
