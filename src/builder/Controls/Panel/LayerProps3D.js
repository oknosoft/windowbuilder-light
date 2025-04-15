import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import {NumberField} from '@oknosoft/ui/DataField/Number';
import FieldSet from '@oknosoft/ui/DataField/FieldSet';
import RefField from '@oknosoft/ui/DataField/RefField';

const meta = {};
const {enm: {positions}, ui} = $p;
const bindMeta = {list: [positions.left, positions.right, positions.top, positions.bottom]};

function RotationField({three, onChange}) {
  const {degree, bind} = three;
  const fld = (bind.is('top') || bind.is('bottom')) ? 'x' : 'y';
  return <NumberField obj={degree} fld={fld} meta={meta} onChange={onChange} label="Поворот" />;
}

function SelectLayerField({editor, three, layer, onChange}) {
  const {bindable, parent, owner} = three;
  const handleMouseDown = (event) => {
    event.preventDefault();
  };
  const handleClick = () => {
    const {contours, props} = owner.project;
    const candidates = bindable ? contours.filter((v) => v !== owner && v.three.parent !== owner) : [];
    if(!candidates.length) {
      return ui.dialogs.alert({title: 'Ведущий слой', text: 'Нет подходящих слоёв на роль ведущего'});
    }
    if(candidates.length === 1) {
      layer.three.parent = candidates[0];
      onChange();
    }
    const tool = editor.tools.find((v) => v.name === 'selectLayer');
    tool.currentLayer = layer;
    tool.onSelect = ({pos}) => {
      layer.three.parent = pos.layer;
      layer.three.bind = pos.bind;
      onChange();
    };
    tool.activate();
  };
  return <FormControl fullWidth>
    <InputLabel>Ведущий слой</InputLabel>
    <Input
      value={bindable ? parent?.index || 'Не задан' : 'Без привязки'}
      inputProps={{readOnly: true}}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            edge="end"
          >
            <HighlightAltIcon />
          </IconButton>
        </InputAdornment>
      }
    />
  </FormControl>;
}

export default function LayerProps3D({editor, tool, project, layer, setContext}) {
  const [index, setIndex] = React.useState(0);
  const {three} = layer;
  const {position, degree, bind, bindable, parent} = three;
  const onChange = () => {
    project.props.registerChange();
    project.redraw();
  };
  const checkTool = () => {
    if(!editor.tool || editor.tool.name === 'selectLayer') {
      editor.tools[0].activate();
      setContext({tool: editor.tool});
    }
  };
  return <FieldSet title="Свойства 3D" defaultExpanded={!layer.layer}>
    <SelectLayerField editor={editor} three={three} layer={layer} onChange={onChange}/>
    <RefField obj={three} fld="bind" meta={bindMeta} label="Привязка" placeholder="Без привязки" />
    {(bind.empty() || !bindable) ? <>
      <NumberField obj={degree} fld="x" meta={meta} onChange={onChange} label="Поворот X" />
      <NumberField obj={degree} fld="y" meta={meta} onChange={onChange} label="Поворот Y" />
      <NumberField obj={degree} fld="z" meta={meta} onChange={onChange} label="Поворот Z" />
    </> : <RotationField three={three} onChange={onChange} />}
    <NumberField obj={position} fld="x" meta={meta} onChange={onChange} label="Смещение X" />
    <NumberField obj={position} fld="y" meta={meta} onChange={onChange} label="Смещение Y" />
    <NumberField obj={position} fld="z" meta={meta} onChange={onChange} label="Смещение Z" />
  </FieldSet>;
}
