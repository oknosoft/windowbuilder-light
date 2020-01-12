import React from 'react';
import PropTypes from 'prop-types';

class Additions extends React.Component {
  render() {
    return <div>Direct-parametric в сервис поставщика</div>;
  }
}

Additions.propTypes = {
  _obj: PropTypes.object.isRequired,
};

export default Additions;
