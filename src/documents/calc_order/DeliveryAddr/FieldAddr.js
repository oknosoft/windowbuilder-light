import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import {onKeyUp} from 'metadata-ui/DataField/enterTab';
import Loading from '../../../aggregate/App/Loading';
const DeliveryAddr = React.lazy(() => import('./DeliveryAddr'));

export default function FieldAddr({obj, fld, meta, label, labelProps, value, onChange, inputProps, fullWidth=true, enterTab, slotProps, ...other}) {
  if((typeof value !== 'string') && obj && fld) {
    value = obj[fld];
    if(inputProps?.type === 'date') {
      value = $p.utils.moment(value).format('YYYY-MM-DD');
    }
  }
  if(!meta && obj && fld) {
    meta = obj._metadata(fld);
  }
  if(!label && meta) {
    label = meta.synonym;
  }
  if(!other.tooltip && meta?.tooltip) {
    other.tooltip = meta.tooltip;
  }
  other.readOnly = true;
  const placeholder = meta?.placeholder;
  const [val, setVal] = React.useState(value);
  const setValue = ({target: {value}}) => {
    if(obj && fld) {
      obj[fld] = value;
      setVal(value);
    }
    onChange?.(value);
  };
  if(enterTab && !other.onKeyUp) {
    other.onKeyUp = onKeyUp;
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePrevent = (event) => event.preventDefault();

  return <>
    <FormControl fullWidth={fullWidth} {...other}>
      {inputProps?.label?.show === false ? null : <InputLabel {...labelProps}>{label}</InputLabel>}
      <Input
        inputProps={{placeholder, ...inputProps}}
        value={val}
        onChange={setValue}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleOpen}
              onMouseDown={handlePrevent}
              onMouseUp={handlePrevent}
              edge="end"
              size="small"
              title="Показать карту"
            >
              <LocationOnOutlinedIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
    {open ? <React.Suspense fallback={<Loading/>}>
      <DeliveryAddr obj={obj} handleCancel={handleClose}/>
    </React.Suspense> : null}
  </>;
}
