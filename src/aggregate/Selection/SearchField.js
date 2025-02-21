import * as React from 'react';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import Input from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import {contentWidth} from '../styles/muiTheme';
import {useLoadingContext} from '../Metadata';

export function listenCtrlF (ev, inputRef) {
  if(ev.ctrlKey && ev.code === 'KeyF') {
    ev.stopPropagation();
    ev.preventDefault();
    inputRef?.current?.firstChild?.focus();
    inputRef?.current?.firstChild?.select();
  }
}

function Icon() {
  const state = useFormControl();
  const icon = React.useMemo(() => <SearchIcon color={state?.focused ? "secondary" : "disabled"} />, [state?.focused]);
  return icon;
}

const SearchField = React.forwardRef(function SearchField({scheme, applySearch}, inputRef) {

  const {handleIfaceState, ifaceState: {drawerOpen}} = useLoadingContext();
  const width = contentWidth(drawerOpen);
  const sx = {flexDirection: 'column-reverse'};
  if(width < 600) {
    sx.minWidth = 200;
  }

  const onBlur = (ev) => {
    const {value} = ev.target;
    if(value !== scheme._search) {
      scheme._search = value;
      applySearch();
    }
  };
  const onKeyDown = (ev) => {
    if(ev.key === 'Enter') {
      ev.stopPropagation();
      ev.preventDefault();
      if(ev.ctrlKey) {
        scheme._search = ev.target.value;
        applySearch();
      }
      else {
        inputRef?.current?.firstChild?.blur();
      }
    }
  };
  const onInput = (ev) => {
    if(!ev.target.value) {
      scheme._search = '';
      applySearch();
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
});

export default SearchField;

