import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {HtmlTooltip} from '../../../aggregate/App/styled';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';


// style={{fontFamily: 'GOST type B'}}

export default function RootToolbar({editor, project, setContext}) {

  const addRoot = () => {
    const layer = project.addLayer();
    project.redraw();
    setContext({type: 'layer', layer, elm: null});
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
