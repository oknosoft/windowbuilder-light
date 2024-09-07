import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import {HtmlTooltip} from '../../../aggregate/App/styled';
import {testProducts} from '../../Toolbar/TestProducts';

// style={{fontFamily: 'GOST type B'}}

export default function RootToolbar({editor, project, setContext}) {

  const addRoot = () => {
    const layer = project.addLayer();
    project.redraw();
    setContext({type: 'layer', layer, elm: null});
    const {square} = testProducts({
      editor,
      type: 'layer',
      layer,
      setContext,
      handleClose() {

      },
    });
    square();
  };

  return <>
    <HtmlTooltip title="Добавить слой рамы">
      <IconButton onClick={addRoot}><AddPhotoAlternateOutlinedIcon /></IconButton>
    </HtmlTooltip>
    <Box sx={{flex: 1}} />
    <HtmlTooltip title="Удалить изделие">
      <IconButton disabled><i className="fa fa-trash-o" /></IconButton>
    </HtmlTooltip>
  </>;
}
