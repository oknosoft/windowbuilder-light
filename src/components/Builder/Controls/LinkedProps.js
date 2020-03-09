/**
 * Табличная часть свойств со связями параметров
 *
 * @module LinkedProps
 *
 * Created by Evgeniy Malyarov on 09.03.2020.
 */

import React from 'react';
import PropTypes from 'prop-types';
import PropField from './PropField';

class LinkedProps extends React.Component {

  render() {
    const {ts, selection} = this.props;
    const {fields} = ts._owner._metadata(ts._name);
    const res = [];
    ts.find_rows(selection, (row) => {
      const {param} = row;
      if(param.is_calculated && !param.show_calculated) {
        return;
      }
      const _meta = Object.assign({}, fields.value);
      _meta.synonym = param.caption || param.name;
      res.push(<PropField key={`prm-${row.row}`} _obj={row} _fld="value" _meta={_meta}/>);
    });
    return res;
  }

}

LinkedProps.propTypes = {
  ts: PropTypes.object.isRequired,
  selection: PropTypes.object.isRequired,
};

export default LinkedProps;
