
import React from 'react';
import PropTypes from 'prop-types';
import PropField from 'metadata-react/DataField/PropField';
import ProfileToolbar from './Toolbar/ProfileToolbar';
import Bar from './Bar';
import ElmInsets from './ElmInsets';
import Coordinates from './Coordinates';
import LinkedProp from './LinkedProp';
import FieldEndConnection from 'wb-forms/dist/CatCnns/FieldEndConnection';
import FieldInsetProfile from '../../CatInserts/FieldInsetProfile';

export default function ProfileProps(props) {
  const {elm, fields, editor} = props;
  const {ProfileSegment} = editor.constructor;

  if(!elm.isInserted()) {
    return 'Элемент удалён';
  }

  const {_scope} = elm.project;
  const eprops = elm.elm_props();
  const select_b = () => {
    _scope.cmd('deselect', [{elm: elm.elm, node: 'e'}]);
    _scope.cmd('select', [{elm: elm.elm, node: 'b'}]);
  };
  const select_e = () => {
    _scope.cmd('deselect', [{elm: elm.elm, node: 'b'}]);
    _scope.cmd('select', [{elm: elm.elm, node: 'e'}]);
  };

  const locked = Boolean(elm.locked);

  return <>
    <ProfileToolbar {...props} />
    <Bar>{`${elm.elm_type} ${elm.info}`}</Bar>
    <FieldInsetProfile elm={elm} disabled={locked || elm instanceof ProfileSegment}/>
    {locked ? null : <>
      <PropField _obj={elm} _fld="clr" _meta={fields.clr}/>

      <Bar>Свойства</Bar>
      <FieldEndConnection elm1={elm} node="b" _fld="cnn1" onClick={select_b}/>
      <FieldEndConnection elm1={elm} node="e" _fld="cnn2" onClick={select_e}/>
      {eprops.map((param, ind) => {
        return <LinkedProp key={`ap-${ind}`} _obj={elm} _fld={param.ref} param={param} cnstr={-elm.elm} fields={fields} />;
      })}
      <Coordinates elm={elm} fields={fields} select_b={select_b} select_e={select_e} />
      <ElmInsets elm={elm}/>
    </>}

  </>;
}

ProfileProps.propTypes = {
  elm: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
};
