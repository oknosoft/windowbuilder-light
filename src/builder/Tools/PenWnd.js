import React from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@oknosoft/ui/DataField/Checkbox';
import {NumberField} from '@oknosoft/ui/DataField/Number';
import RefField from '@oknosoft/ui/DataField/RefField';
import Settings from '../Controls/Panel/Settings';

const meta = {};
function PenWnd({editor, layer}) {
  const {tool, project} = editor;
  const {profile: dp, options} = tool;
  if(!layer) {
    layer = project.activeLayer;
  }
  const [elm_type, set_elm_type] = React.useState(dp.elm_type);
  const elm_type_change = (value) => {
    dp.elm_type = value;
    //dp.inset = project.default_inset({elm_type: dp.elm_type, elm: project});
    set_elm_type(dp.elm_type);
  };

  return <>
    <FormControl fullWidth readOnly>
      <InputLabel>Текущий слой</InputLabel>
      <Input readOnly value={layer?.presentation}/>
    </FormControl>
    <Settings editor={editor} project={project}/>
    <RefField obj={dp} fld="elm_type" onChange={elm_type_change}/>
    <Checkbox obj={dp} fld="bind_sys" />

  </>;
}


export default PenWnd;
