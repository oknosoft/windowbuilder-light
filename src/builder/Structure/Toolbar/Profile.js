import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {HtmlTooltip} from '../../../aggregate/App/styled';
import AddHomeWorkOutlinedIcon from '@mui/icons-material/AddHomeWorkOutlined';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';


// style={{fontFamily: 'GOST type B'}}

export default function ProfileToolbar({editor, project, layer, elm, setContext}) {

  const remove = () => {
    elm?.remove();
    project?.redraw();
  }

  return <>
    <HtmlTooltip title="Добавить узел">
      <IconButton disabled><i className="tb_add_segment gl disabled"/></IconButton>
    </HtmlTooltip>
    <Box sx={{flex: 1}} />
    <HtmlTooltip title="Удалить элемент">
      <IconButton onClick={remove}><i className="fa fa-trash-o" /></IconButton>
    </HtmlTooltip>
  </>
}
