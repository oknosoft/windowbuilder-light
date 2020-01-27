import React from 'react';
import PropTypes from 'prop-types';

export default function ElmProps({elm1, elm2}) {
  return <div>
    {`Дерево свойств ${elm2 ? 'элементов' : 'элемента'} ${elm1 ? elm1.elm : '---'}${elm2 ? ` и ${elm2.elm}` : ''}  `}
  </div>;
}

ElmProps.propTypes = {
  elm1: PropTypes.object,
  elm2: PropTypes.object,
};
