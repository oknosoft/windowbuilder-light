import React from 'react';
import PropTypes from 'prop-types';
import PropField from './PropField';
import FlapToolbar from './FlapToolbar';

function Flap({editor}) {
  const {project} = editor;
  const {activeLayer: contour} = project;
  const is_flap = contour.layer;
  const disabled = contour.layer ? '' : 'gl disabled';
  //const row = is_flap && ox.constructions.find({cnstr: contour.cnstr});

  return <div>
    <FlapToolbar contour={contour} disabled={disabled}/>
    <div className={disabled}>
      <PropField _obj={contour} _fld="furn" />
      <PropField _obj={contour} _fld="direction" />
      <PropField _obj={contour} _fld="h_ruch" />
    </div>
  </div>;
}

Flap.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default Flap;
