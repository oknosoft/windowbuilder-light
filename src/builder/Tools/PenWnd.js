import React from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@oknosoft/ui/DataField/Checkbox';
import {NumberField} from '@oknosoft/ui/DataField/Number';
import RefField from '@oknosoft/ui/DataField/RefField';
//import FieldInsetProfile from 'wb-core/dist/forms/CatInserts/FieldInsetProfile';

function PenWnd({editor, layer}) {
  const {tool, project} = editor;
  const {profile, options} = tool;
  if(!layer) {
    layer = project.activeLayer;
  }

  const [elm_type, set_elm_type] = React.useState(profile.elm_type);
  const elm_type_change = (value) => {
    profile.elm_type = value;
    //profile.inset = project.default_inset({elm_type: profile.elm_type, elm: project});
    set_elm_type(profile.elm_type);
  };

  return <>
    <FormControl fullWidth readOnly>
      <InputLabel>Текущий слой</InputLabel>
      <Input readOnly value={layer?.presentation ? layer.presentation() : '-'}/>
    </FormControl>
    <RefField obj={profile} fld="elm_type" onChange={elm_type_change}/>
    <Checkbox obj={profile} fld="bind_generatrix" />
    <Checkbox obj={profile} fld="bind_node" />
    <Checkbox obj={profile} fld="bind_sys" />
    <NumberField obj={profile} fld="grid"/>
  </>;
}


export default PenWnd;
