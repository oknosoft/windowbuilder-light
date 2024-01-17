import React from 'react';
import RefField from './RefField';
import Checkbox from './Checkbox';
import Text from './Text';
import {NumberField} from './Number';

export default function ParamField({obj, fld, param, cnstr, meta, inset, label, onChange, fullWidth=true, ...other}) {
  if(!param) {
    param = obj.param;
  }
  if(!cnstr) {
    cnstr = obj.cnstr || 0;
  }
  if(!inset) {
    inset = obj.inset;
  }
  if(!fld) {
    fld='value';
  }
  // вычисляемые скрываем всегда
  let hide = !param.show_calculated && param.is_calculated;

  if(!meta) {
    const {utils} = $p;
    meta = utils._clone(obj._metadata('value'));
    meta.type = utils._clone(param.type);
    meta.mandatory = param.mandatory;
    meta.synonym = label || param.caption || param.name;
  }
  const {types} = meta.type;

  if(!meta.type.is_ref) {
    let Component;
    if(types.includes('boolean')) {
      Component = Checkbox;
    }
    else if(types.includes('string')) {
      Component = Text;
    }
    if(types.includes('number')) {
      Component = NumberField;
    }
    if(Component) {
      return <Component obj={obj} meta={meta} fld={fld} fullWidth={fullWidth} {...other} />;
    }
    hide = true;
  }

  // учтём дискретный ряд - он приоритетнее связей параметров
  let oselect = types.length === 1 && ['cat.property_values', 'cat.characteristics'].includes(types[0]);
  const drow = inset?.product_params?.find({param});
  if(drow) {
    if(!hide){
      hide = drow.hide || obj.hide;
    }
    if(drow?.list) {
      try{
        meta.list = JSON.parse(drow.list);
        oselect = true;
      }
      catch (e) {
        delete meta.list;
      }
    }
    else {
      delete meta.list;
    }
  }
  else {
    // если нет умолчаний во вставке, используем связи
    const lnk_props = {obj, grid: {selection: {cnstr, inset}}};
    const links = param.params_links(lnk_props);
    // если для параметра есть связи - сокрытие по связям
    if(!hide){
      if(links.length) {
        hide = links.some((link) => link.hide);
      }
      else {
        hide = obj.hide;
      }
    }
    // дополним метаданные отбором
    if (links.length) {
      const values = [];
      param.linked_values(links, null, values);
      if(values.length) {
        if(values.length < 50) {
          oselect = true;
        }
        if(!meta.choice_params) {
          meta.choice_params = [];
        }
        // дополняем отбор
        meta.choice_params.push({
          name: 'ref',
          path: {in: values.map((v) => v.value)}
        });
      }
    }
    else if(oselect && types[0] === 'cat.property_values') {
      meta.list = [];
      $p.cat.property_values.find_rows({owner: param}, (v) => {
        meta.list.push(v);
      });
    }
  }

  return hide ? null : <RefField
    obj={obj}
    fld={fld}
    meta={meta}
    onChange={onChange}
    fullWidth={fullWidth}
    {...other}
  />;
}
