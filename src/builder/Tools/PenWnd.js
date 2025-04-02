import React from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@oknosoft/ui/DataField/Checkbox';
import {NumberField} from '@oknosoft/ui/DataField/Number';
import RefField from '@oknosoft/ui/DataField/RefField';
import {PenSelectMode, glob} from './PenSelectMode';
import Settings from '../Controls/Panel/Settings';

const meta = {};

function PenWnd({editor, layer}) {
  const {tool, project} = editor;
  const {profile: dp, options} = tool;
  if(!layer) {
    layer = project.activeLayer;
  }
  const selectModeRef = React.createRef(null);
  const [elm_type, set_elm_type] = React.useState(dp.elm_type);
  const elm_type_change = (value) => {
    dp.elm_type = value;
    //dp.inset = project.default_inset({elm_type: dp.elm_type, elm: project});
    set_elm_type(dp.elm_type);
    if(!glob.meta.fields.mode.exTypes.includes(dp.elm_type.name)) {
      if(dp.mode) {
        dp.mode = 0;
        selectModeRef.current?.setValue(glob.init(0));
      }
      tool.set({tolerance: tool.get('defaultTolerance')});
    }
    else {
      tool.set({tolerance: 40});
    }
  };

  return <>
    <FormControl fullWidth readOnly>
      <InputLabel>Текущий слой</InputLabel>
      <Input readOnly value={layer?.presentation}/>
    </FormControl>
    <RefField obj={dp} fld="elm_type" onChange={elm_type_change}/>
    <PenSelectMode obj={dp} ref={selectModeRef}/>
    <Checkbox obj={dp} fld="bind_sys" />
  </>;
}


export default PenWnd;
