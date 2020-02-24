import React from 'react';
import PropTypes from 'prop-types';
import PropField from './PropField';

function Params({editor, root}) {
  const {project} = editor;
  const {_dp, activeLayer} = project;
  const is_flap = !root && activeLayer.layer;
  //const row = is_flap && ox.constructions.find({cnstr: activeLayer.cnstr});
  return <div>
    {root ? `Свойства изделия` : `Свойства слоя №${activeLayer.cnstr}`}
    {is_flap && <PropField _obj={activeLayer} _fld="furn" />}
    {is_flap && <PropField _obj={activeLayer} _fld="direction" />}
    {is_flap && <PropField _obj={activeLayer} _fld="h_ruch" />}

    {root && <PropField _obj={_dp} _fld="sys" />}
    {root && <PropField _obj={_dp} _fld="clr" />}
    {root && <PropField _obj={_dp} _fld="len" read_only/>}
    {root && <PropField _obj={_dp} _fld="height" read_only/>}
    {root && <PropField _obj={_dp} _fld="s" read_only/>}
  </div>;
}

Params.propTypes = {
  editor: PropTypes.object.isRequired,
  root: PropTypes.bool,
};

export default Params;
