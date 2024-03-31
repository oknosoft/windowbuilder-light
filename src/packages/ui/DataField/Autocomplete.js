import React from 'react';
import MuiAutocomplete from '@mui/material/Autocomplete';
import StyledInput from './StyledInput';

const getOptionLabel = (v) => v?.presentation || v?.name || v?.toString() || '';

/**
 * @summary Висящее в воздухе поле ввода
 * @desc Это не совсем DataField.
 * Он не редактирует DataObj, но позволяет показать и выбрать из списка, значение DataObj
 */
export default function Autocomplete({label, fullWidth, disableClearable, placeholder, labelProps, ...other}) {

  if(typeof disableClearable !== 'boolean') {
    disableClearable = true;
  }

  return <MuiAutocomplete
    disableListWrap
    disableClearable={disableClearable}
    clearText="Очистить"
    openText="Показать список"
    closeText="Закрыть список"
    getOptionLabel={getOptionLabel}
    renderInput={(params) => <StyledInput {...params} labelProps={labelProps} fullWidth={fullWidth} label={label} placeholder={placeholder}/>}
    //renderOption={(props, option, state) => <Typography key={option.ref} noWrap>{option.name}</Typography>}
    {...other}
  />;
}
