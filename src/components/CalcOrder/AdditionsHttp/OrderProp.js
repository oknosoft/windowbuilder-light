/**
 *
 *
 * @module OrderProp
 *
 * Created by Evgeniy Malyarov on 26.02.2020.
 */

import React from 'react';
import PropTypes from 'prop-types';
import FieldSelect from 'metadata-react/DataField/FieldSelectStatic';
import FieldNumber from 'metadata-react/DataField/FieldNumber';
import FieldText from 'metadata-react/DataField/FieldText';
import withStyles, {extClasses} from 'metadata-react/DataField/stylesPropertyGrid';

class LVal {
  constructor(v) {
    Object.assign(this, v);
  }
  toString() {
    return this.name || '';
  }
  valueOf() {
    return this.ref || this.val || this.id || '';
  }
}

const meta = (supplier, sprms, _fld) => {
  let {type, values, name} = supplier.prm(_fld);
  const sprm = sprms.find((v) => v.alias === _fld || v.id === _fld);
  let options = [];
  if(Array.isArray(values) && Array.isArray(sprm.values) && type === 'object') {
    if(values.length && sprm.values.length) {
      options = sprm.values.map((v) => {
        return new LVal(values[v] || values.find((cval) => cval.ref === v));
      });
    }
    else if(values.length) {
      options = values.map((v) => new LVal(v));
    }
    else if(sprm.values.length) {
      options = sprm.values.map((v) => new LVal(v));
    }
  }
  else if(Array.isArray(sprm.values) && sprm.values.length && type === 'enum') {
    options = sprm.values;
  }
  else if(Array.isArray(values) && values.length && type === 'enum') {
    options = values;
  }
  return {
    _meta: {synonym: name},
    options,
    type,
    Field: ['object','enum'].includes(type) ? FieldSelect : (type === 'number' ? FieldNumber : FieldText),
  };
};

function OrderProp({classes, _obj, _fld, sprms, supplier, ...props}) {
  const {Field, type, options, ...others} = meta(supplier, sprms, _fld);
  if('enum' === type && options && _obj[_fld] && !options.includes(_obj[_fld])) {
    _obj[_fld] = options.length ? options[0] : '';
  }
  else if('object' === type && options && _obj[_fld] && !options.some((v) => _obj[_fld] == v.valueOf())) {
    _obj[_fld] = options.length ? options[0].valueOf() : '';
  }
  return <Field
    extClasses={extClasses(classes)}
    fullWidth
    isTabular={false}
    _obj={_obj}
    _fld={_fld}
    options={options}
    {...others}
    {...props}
  />;
}

OrderProp.propTypes = {
  classes: PropTypes.object,
  _obj: PropTypes.object,
  _fld: PropTypes.string,
  supplier: PropTypes.object,
  sprms: PropTypes.array,
};

export default withStyles(OrderProp);
