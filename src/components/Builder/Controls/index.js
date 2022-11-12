import React from 'react';
import PropTypes from 'prop-types';
const ControlsFrame = React.lazy(() => import('./ControlsFrame'));

export default function Controls(props) {
  return props.editor ?
    <React.Suspense fallback="Загрузка...">
      <ControlsFrame {...props}/>
    </React.Suspense> : "Загрузка...";
}

Controls.propTypes = {
  editor: PropTypes.object.isRequired,
};
