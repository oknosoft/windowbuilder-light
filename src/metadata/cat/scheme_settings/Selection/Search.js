import * as React from 'react';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import Input from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import {contentWidth} from '../../../../styles/muiTheme';
import {useLoadingContext} from '../../../../components/Metadata';

function listenCtrlF (ev, inputRef) {
  if(ev.ctrlKey && ev.code === 'KeyF') {
    ev.stopPropagation();
    ev.preventDefault();
    inputRef?.current?.firstChild?.focus();
  }
}

function Icon() {
  const state = useFormControl();
  const icon = React.useMemo(() => <SearchIcon color={state?.focused ? "secondary" : "disabled"} />, [state?.focused]);
  return icon;
}

export default function SearchField({scheme, setRefresh}) {
  const inputRef = React.useRef(null);
  const {handleIfaceState, ifaceState: {menu_open}} = useLoadingContext();
  const width = contentWidth(menu_open);
  const sx = {pr: 'unset'};
  if(width < 600) {
    sx.minWidth = 200;
  }

  // фокуссируем поле по {Ctrl+F}
  React.useEffect(() => {
    const listen = (ev) => listenCtrlF(ev, inputRef);
    addEventListener('keydown', listen, false);
    return () => removeEventListener('keydown', listen);
  }, []);

  const onBlur = (ev) => {
    const {value} = ev.target;
    if(value !== scheme._search) {
      scheme._search = value;
      setRefresh();
    }
  };
  const onKeyDown = (ev) => {
    if(ev.key === 'Enter') {
      ev.stopPropagation();
      ev.preventDefault();
      if(ev.ctrlKey) {
        scheme._search = ev.target.value;
        setRefresh();
      }
      else {
        inputRef?.current?.firstChild?.blur();
      }
    }
  };
  const onInput = (ev) => {
    if(!ev.target.value) {
      scheme._search = '';
      setRefresh();
    }
  };

  return (
    <FormControl sx={sx}>
      <Input
        ref={inputRef}
        type="search"
        placeholder="Введите текст для поиска"
        endAdornment={<Icon />}
        onBlur={onBlur}
        inputProps={{onKeyDown, onInput}}
        defaultValue={scheme._search}
      />
    </FormControl>
  );
}
