import RootToolbar from './Root';
import LayerToolbar from './Layer';
import ElmToolbar from './Profile';
import {useBuilderContext} from '../../Context';

export default function StructureToolbar () {
  const {editor, type, project, layer, elm, setContext} = useBuilderContext();
  if(type === 'layer' && layer) {
    return LayerToolbar({project, layer, elm, setContext});
  }
  else if(type === 'elm' && elm) {
    return ElmToolbar({project, layer, elm, setContext});
  }
  return RootToolbar({editor, project, layer, setContext});
}
