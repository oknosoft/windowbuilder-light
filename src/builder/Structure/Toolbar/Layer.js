import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {HtmlTooltip} from '../../../aggregate/App/styled';
import AddLayer from './AddLayer';
import {useBuilderContext} from '../../Context';

// style={{fontFamily: 'GOST type B'}}

export default function LayerToolbar(props) {
  const {editor, project, layer, elm, setContext} = props;
  const addRoot = () => {
    const layer= project.addLayer();
    project.redraw();
    setContext({type: 'layer', layer, elm: null});
  };
  const addFlap = () => {
    //setContext({stamp: project.props.stamp, tool: editor.tool});
  };
  const removeFlap = () => {
    const {props} = project;
    const parent = layer.layer;
    parent?.activate();
    setContext({
      type: parent ? 'layer' : 'product',
      layer: parent || null,
    });
    layer.remove();
    project.redraw();
    project.zoomFit();
  };
  return <>
    <AddLayer {...props} />
    <Box sx={{flex: 1}} />
    <HtmlTooltip title="Удалить текуший слой">
      <IconButton onClick={removeFlap}><i className="fa fa-trash-o" /></IconButton>
    </HtmlTooltip>
  </>
}
