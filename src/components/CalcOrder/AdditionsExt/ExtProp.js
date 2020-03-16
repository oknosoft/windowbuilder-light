import React from 'react';
import PropTypes from 'prop-types';
import DataField from 'metadata-react/DataField';
//import withStyles, {extClasses} from 'metadata-react/DataField/stylesPropertyGrid';

function PropField({row, param, meta, ...props}) {

  const _fld = param.valueOf();
  const _meta = Object.assign({}, meta.fields[_fld]);
  const {types} = param.type;
  let oselect = types.length === 1 && types[0] === 'cat.property_values';

  const grid = {selection: {cnstr: row.row}};
  const links = param.params_links({grid, obj: row});

  // вычисляемые скрываем всегда
  let hide = !param.show_calculated && param.is_calculated;
  // если для параметра есть связи - сокрытие по связям
  if(!hide && links.length){
    hide = links.some((link) => link.hide);
  }
  if(hide) {
    return null;
  }

  // проверим вхождение значения в доступные и при необходимости изменим
  if (links.length) {
    const values = [];
    if(param.linked_values(links, row, values)) {
      notify = true;
    }
    if(values.length) {
      if(values.length < 50) {
        oselect = true;
      }
      if(!_meta.choice_params) {
        _meta.choice_params = [];
      }
      // дополняем отбор
      _meta.choice_params.push({
        name: 'ref',
        path: {in: values.map((v) => v.value)}
      });
    }
  }

  return <DataField
    _obj={row}
    _fld={_fld}
    _meta={_meta}
    ctrl_type={oselect ? 'oselect' : void 0}
    //extClasses={extClasses(classes)}
    isTabular={false}
    {...props}
  />;
}

PropField.propTypes = {
  //classes: PropTypes.object,
  row: PropTypes.object,
  param: PropTypes.object,
  meta: PropTypes.object,
};

export default PropField;
