import React from 'react';
import PropTypes from 'prop-types';
import DataField from 'metadata-react/DataField';
import withStyles, {extClasses} from 'metadata-react/DataField/stylesPropertyGrid';
import ElmToolbar from './ElmToolbar';

function ElmProps({elm1, elm2, editor, classes}) {
  const ext = extClasses(classes);
  const {fields} = elm1 ? elm1._metadata : {};
  return <div>
    <ElmToolbar editor={editor} elm={elm1} />
    {
      elm1 ? <div>
          <DataField _obj={elm1} _fld="info" _meta={fields.info} extClasses={ext} fullWidth read_only/>
          <DataField _obj={elm1} _fld="inset" _meta={fields.inset} extClasses={ext} fullWidth/>
          <DataField _obj={elm1} _fld="clr" _meta={fields.clr} extClasses={ext} fullWidth/>
      </div>
        : <div>Элемент не выбран</div>
    }
  </div>;
}

ElmProps.propTypes = {
  elm1: PropTypes.object,
  elm2: PropTypes.object,
  editor: PropTypes.object,
  classes: PropTypes.object,
};

export default withStyles(ElmProps);
