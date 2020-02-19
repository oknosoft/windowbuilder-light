import React from 'react';
import PropTypes from 'prop-types';
import DataField from 'metadata-react/DataField';
import withStyles, {extClasses} from 'metadata-react/DataField/stylesPropertyGrid';

function ElmProps({elm1, elm2, classes}) {
  if(!elm1) {
    return <div>Элемент не выбран</div>;
  }
  const ext = extClasses(classes);
  const {fields} = elm1._metadata;
  return <div>
    <DataField _obj={elm1} _fld="info" _meta={fields.info} extClasses={ext} fullWidth read_only/>
    <DataField _obj={elm1} _fld="inset" _meta={fields.inset} extClasses={ext} fullWidth/>
    <DataField _obj={elm1} _fld="clr" _meta={fields.clr} extClasses={ext} fullWidth/>
  </div>;
}

ElmProps.propTypes = {
  elm1: PropTypes.object,
  elm2: PropTypes.object,
  classes: PropTypes.object,
};

export default withStyles(ElmProps);
