import React from 'react';
import PropTypes from 'prop-types';
import PropField from './PropField';
import ProductToolbar from './ProductToolbar';

function Product({editor}) {
  const {project} = editor;
  const {_dp} = project;
  return <div>
    <ProductToolbar project={project}/>
    <PropField _obj={_dp} _fld="sys" />
    <PropField _obj={_dp} _fld="clr" />
    <PropField _obj={_dp} _fld="len" read_only/>
    <PropField _obj={_dp} _fld="height" read_only/>
    <PropField _obj={_dp} _fld="s" read_only/>
  </div>;
}

Product.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default Product;
