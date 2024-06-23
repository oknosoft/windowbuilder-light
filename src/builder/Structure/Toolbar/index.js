import RootToolbar from './Root';
import LayerToolbar from './Layer';
import {useBuilderContext} from '../../Context';

export default function StructureToolbar () {
  const {editor, type, project, layer, elm, setContext} = useBuilderContext();
  if(type === 'layer') {
    return LayerToolbar({project, layer, elm, setContext});
  }
  return RootToolbar({editor, project, layer, setContext});
}
