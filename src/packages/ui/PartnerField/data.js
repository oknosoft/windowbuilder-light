import { createFilterOptions } from '@mui/material/Autocomplete';

const {adapters: {pouch}, ui: {dialogs}, cat: {partners}, utils} = $p;

const filter = createFilterOptions({
  stringify(v) {
    return `${v.name}-${v.inn}`;
  }
});

export const filterOptions = (options, params) => {
  const filtered = filter(options, params);
  const {inputValue} = params;
  if ((inputValue?.length === 10 || inputValue?.length === 12) && inputValue.match(/^[0-9]*$/)) {
    if(!options.find(v => v.inn === inputValue)) {
      filtered.push({
        ref: inputValue,
        action: 'create',
        name: `Создать по ИНН "${inputValue}"`,
      });
    }
  }
  return filtered;
};

export const getOptions = (obj, fld, meta) => {
  return () => {
    const res = [];
    for(const o of partners) {
      if(!o.is_buyer || o.is_folder) {
        continue;
      }
      res.push(o);
    }
    return res;
  };
};
