import React from 'react';
import PropTypes from 'prop-types';
import GlassToolbar from './GlassToolbar';
import InsetToolbar from './InsetToolbar';
import LayersToolbar from './LayersToolbar';
import PairToolbar from './PairToolbar';
import ProfileToolbar from './ProfileToolbar';
import RootToolbar from './RootToolbar';

export default function Toolbar(props) {
  const {editor: {project}, type, elm, layer} = props;
  switch (type) {
  case 'elm':
    return <GlassToolbar {...props}/>;
  case 'pair':
    return <PairToolbar {...props}/>;
  case 'grp':
    return <PairToolbar {...props}/>;
  case 'layer':
    return <LayersToolbar {...props}/>;
  default:
    return <RootToolbar {...props}/>;
  }
}

Toolbar.propTypes = {
  editor: PropTypes.object,
  current: PropTypes.object,
};
