
import React from 'react';
import {Treebeard, decorators, filters} from '@oknosoft/ui/Treebeard';
import getStruct from './getStruct';
import {useBuilderContext} from '../Context';


export default function StructureTree() {
  const {editor, project, type, elm, layer, stamp, setContext} = useBuilderContext();
  const struct = React.useMemo(() => {
    return editor ? getStruct(editor) : null;
  }, [editor, stamp]);
  const [index, setIndex] = React.useState(0);

  if(!struct) {
    return 'Загрузка...';
  }
  if(type === 'elm' && elm) {
    const node = struct?.find_node(layer);
    if(node && !node.toggled) {
      node.expand();
    }
  }

  const onClickHeader = (node) => {
    struct.deselect();
    const curr = {project, elm: null, layer: null, type: 'root'};
    if(node._owner === editor) {
      setContext(curr);
    }
    else if(node.type === 'product') {
      curr.type = 'product';
      if(curr.project !== node._owner) {
        curr.project?.deselectAll?.();
        curr.project = node._owner;
        curr.project.activate();
        editor.refreshTools();
      }
      setContext({stamp: curr.project.props.stamp, tool: editor.tool, ...curr});
    }
    else if(node.type === 'layer') {
      const curr = {project, elm: null, layer, type: 'layer'};
      if(curr.project !== node._owner.project) {
        curr.project?.deselectAll?.();
        curr.project = node._owner.project;
        curr.project.activate();
        editor.refreshTools();
      }
      if(curr.layer !== node._owner) {
        curr.layer = node._owner;
        curr.layer.activate();
        editor.eve.emit_promise('select', {...curr});
      }
      setContext({stamp: curr.project.props.stamp, tool: editor.tool, ...curr});
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
