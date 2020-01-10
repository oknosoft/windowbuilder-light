import React from 'react';
import PropTypes from 'prop-types';

export default function ElmProps(props) {
  return <div>
    Дерево свойств элемента
  </div>;
}

ElmProps.propTypes = {
  editor: PropTypes.object.isRequired,
};
