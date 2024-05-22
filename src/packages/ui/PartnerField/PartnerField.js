import React from 'react';
import Autocomplete from '../DataField/Autocomplete';
import {onKeyUp} from '../DataField/enterTab';
import {filterOptions, getOptions} from './data';
import DialogCreate from './DialogCreate';

const {adapters: {pouch}, ui: {dialogs}, cat: {partners}, utils} = $p;

export default function PartnerField({obj, fld, meta, label, onChange, fullWidth=true, enterTab, ...other}) {

  let [value, setValue] = React.useState();
  if(value === undefined && obj && fld) {
    value = obj[fld];
  }
  if(!meta && obj && fld) {
    meta = obj._metadata(fld);
  }
  if(!label && label !== false && meta) {
    label = meta.synonym;
  }

  const [open, setOpen] = React.useState(null);
  const handleClose = () => {
    setOpen(null);
    setValue(obj[fld]);
  };

  const options = React.useMemo(getOptions(obj, fld, meta), [obj]);

  if(enterTab && !other.onKeyUp) {
    other.onKeyUp = function (ev) {
      if(enterTab) {
        onKeyUp(ev);
      }
    };
  }

  const handleChange = (event, newValue, reason, details) => {
    if(newValue?.action === 'create') {
      event.preventDefault();
      event.stopPropagation();
      event.defaultMuiPrevented = true;
      enterTab = false;
      // запрос информации по инн - если успешно, возвращает массив сырых описаний, иначе - описание ошибки
      pouch.fetch(`/r/partners/${newValue.ref}`)
        .then((res) => res.json())
        .then((raw) => {
          if(raw.error) {
            throw raw.message;
          }
          if(Array.isArray(raw)) {
            setOpen(raw);
          }
        })
        .catch((err) => {
          setValue(obj[fld]);
          dialogs.alert({
            title: 'Контрагент по ИНН',
            text: err?.message || err,
          });
        });
    }
    else {
      obj[fld] = newValue;
      onChange?.(newValue);
      setValue(obj[fld]);
    }
  };

  const handleSubmit = () => {
    // запрос на создание
    pouch.fetch(`/r/partners`, {
        method: 'PUT',
        body: JSON.stringify({
          raw: open[0],
          organization: obj.organization.ref,
        })}
    )
      .then((res) => res.json())
      .then((raw) => {
        if(raw.error) {
          throw raw.message;
        }
        obj[fld] = raw.ref;
        value = obj[fld];
        if(value.is_new()) {
          value.name = raw.name;
        }
        if(obj.contract.empty() && raw.main_contract) {
          obj.contract = raw.main_contract;
          if(obj.contract.is_new()) {
            obj.contract.name = 'Основной';
          }
        }
        setValue(value);
      })
      .catch((err) => {
        setValue(obj[fld]);
        dialogs.alert({
          title: 'Контрагент по ИНН',
          text: err?.message || err,
        });
      });
    setOpen(null);
  };

  return <>
    <Autocomplete
      options={options}
      onChange={handleChange}
      filterOptions={filterOptions}
      value={value}
      label={label}
      fullWidth={fullWidth}
      disableClearable={Boolean(meta.mandatory)}
      placeholder="введите ИНН или название"
      autoHighlight
      clearOnBlur
      {...other}
    />
    {open ? <DialogCreate
      raw={open}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      obj={obj}
    /> : null}
  </>;
}

