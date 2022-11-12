
import React from 'react';
import PropTypes from 'prop-types';
import PropField from 'metadata-react/DataField/PropField';
import LinkedProps from 'wb-forms/dist/Common/LinkedProps';
import RootToolbar from './Toolbar/RootToolbar';

const {blank} = $p.utils;

export default function ProductProps(props) {
  const {ox, editor} = props;
  const {project} = editor;
  const {_dp} = project;

  // корректируем метаданные поля выбора цвета
  const clr_group = $p.cat.clrs.selection_exclude_service(_dp._metadata('clr'), _dp, project);

  return <>
    <RootToolbar project={project} ox={ox} _dp={_dp} />
    <PropField fullWidth _obj={_dp} _fld="sys"/>
    <PropField fullWidth _obj={_dp} _fld="clr" clr_group={clr_group}/>
    <LinkedProps ts={ox.params} cnstr={0} inset={blank.guid}/>
  </>;
}

ProductProps.propTypes = {
  editor: PropTypes.object.isRequired,
  ox: PropTypes.object.isRequired,
};
