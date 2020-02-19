import React from 'react';
import PropTypes from 'prop-types';
import DataField from 'metadata-react/DataField';
import withStyles, {extClasses} from 'metadata-react/DataField/stylesPropertyGrid';

function TextWnd({editor, classes}) {
  const {tool} = editor;
  const {text} = tool;
  const ext = extClasses(classes);
  return text ? <div>
    <DataField _obj={text} _fld="text" extClasses={ext} fullWidth/>
    <DataField _obj={text} _fld="font_family" extClasses={ext} fullWidth/>
    <DataField _obj={text} _fld="bold" extClasses={ext} fullWidth ctrl_type="cb"/>
    <DataField _obj={text} _fld="font_size" extClasses={ext} fullWidth/>
    <DataField _obj={text} _fld="angle" extClasses={ext} fullWidth/>
    <DataField _obj={text} _fld="align" extClasses={ext} fullWidth ctrl_type="oselect"/>
    <DataField _obj={text} _fld="clr" extClasses={ext} fullWidth/>
    <DataField _obj={text} _fld="x" extClasses={ext} fullWidth/>
    <DataField _obj={text} _fld="y" extClasses={ext} fullWidth/>
  </div> :
    <div>Элемент текста не выбран</div>;
}

TextWnd.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default withStyles(TextWnd);
