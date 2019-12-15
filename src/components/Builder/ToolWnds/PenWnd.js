import React from 'react';
import PropTypes from 'prop-types';
import StandardForms from './StandardForms';

export default function PenWnd({editor}) {
  return <div>
    Pen
    <StandardForms editor={editor} />
  </div>;
}

PenWnd.propTypes = {
  editor: PropTypes.object.isRequired,
};
