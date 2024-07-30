import React from 'react';
import RefField from 'metadata-ui/DataField/RefField';
import Text from 'metadata-ui/DataField/Text';
import {NumberField} from 'metadata-ui/DataField/Number';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


function selectionObj(row, checked, setChecked) {
  return React.useMemo(() => {
    const mgr = $p.md.mgr_by_class_name(row.right_value_type);
    const typeMeta = mgr.metadata();
    const label = row.caption || (typeMeta?.obj_presentation || typeMeta?.synonym || row.left_value);
    const meta = {
      synonym: label,
      type: {
        is_ref: Boolean(mgr),
        types: [row.right_value_type]
      }
    };
    const selectionHandler = {
      get(target, prop, receiver) {
        switch (prop) {
          case 'value':
            return mgr ? mgr.get(target.right_value) : target.right_value;
          case '_metadata':
            return () => meta;
          case '_manager':
            return mgr;
          case 'label':
            return label;
        }
      },
      set(target, prop, val, receiver) {
        switch (prop) {
          case 'value':
            target.right_value = val?.valueOf() || '';
            if(checked && (!val || val?.empty())) {
              target.use = false;
              setChecked(false);
            }
            if(!checked && (val?.empty && !val.empty())) {
              target.use = true;
              setChecked(true);
            }
        }
        return true;
      }
    };
    return new Proxy(row, selectionHandler);

  }, [row]);
}

/**
 * @summary Поле-редактор быстрого отбора
 * @desc Получает на вход, строку табчасти selection справочника компоновки
 * @param row
 * @return {JSX.Element}
 */
export default function QuickSelection({row}) {
  const [checked, setChecked] = React.useState(row.use);

  const handleChange = (event) => {
    row.use = event.target.checked;
    setChecked(row.use);
  };

  const obj = selectionObj(row, checked, setChecked);
  const Component = obj._manager ? RefField : Text;

  return <Component
    obj={obj}
    fld="value"
    label={<span>
      <Checkbox checked={checked} onChange={handleChange}/>
      {obj.label}
      </span>}
    noBorder
  />;
}
