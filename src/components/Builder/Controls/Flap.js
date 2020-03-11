import React from 'react';
import PropTypes from 'prop-types';
import PropField from './PropField';
import FlapToolbar from './FlapToolbar';
import LinkedProps from './LinkedProps';

function Flap({editor}) {
  const {project} = editor;
  const {activeLayer: contour, ox} = project;
  const is_flap = contour.layer;
  const disabled = contour.layer ? '' : 'gl disabled';
  const {utils} = $p;

  return <div>
    <FlapToolbar contour={contour} disabled={disabled}/>
    <div className={disabled}>
      <PropField _obj={contour} _fld="furn" />
      <PropField _obj={contour} _fld="direction" />
      <PropField _obj={contour} _fld="h_ruch" />
    </div>
    {!disabled && <LinkedProps ts={ox.params} cnstr={contour.cnstr} inset={utils.blank.guid} />}
  </div>;
}

Flap.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default Flap;
