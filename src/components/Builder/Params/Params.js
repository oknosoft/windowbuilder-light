import React from 'react';
import PropTypes from 'prop-types';

export default function Params(props) {
  return <div>
    {props.root ? `Свойства изделия` : `Свойства слоя №${props.editor.project.activeLayer.cnstr}`}
  </div>;
}

Params.propTypes = {
  editor: PropTypes.object.isRequired,
  root: PropTypes.bool,
};
