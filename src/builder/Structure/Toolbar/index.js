import RootToolbar from './Root';
import LayerToolbar from './Layer';
import ProfileToolbar from './Profile';
import FillingToolbar from './Filling';
import {useBuilderContext} from '../../Context';

export default function StructureToolbar () {
  const {editor, type, project, layer, elm, setContext} = useBuilderContext();
  if(type === 'layer' && layer) {
    return LayerToolbar({project, layer, elm, setContext});
  }
  else if(type === 'elm' && elm) {
    return elm instanceof editor.Filling ?
      FillingToolbar({editor, project, layer, elm, setContext}) :
      ProfileToolbar({editor, project, layer, elm, setContext});
  }
  return RootToolbar({editor, project, layer, setContext});
}
