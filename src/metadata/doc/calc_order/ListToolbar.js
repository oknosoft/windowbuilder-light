import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/DriveFileRenameOutline';
import {useNavigate} from 'react-router-dom';
import {Toolbar, HtmlTooltip} from '../../../components/App/styled';
export default function ListToolbar({selectedRows}) {
  const navigate = useNavigate();
  return <Toolbar disableGutters>
    <HtmlTooltip title="Создать документ">
      <IconButton><AddIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Создать документ копированием текущего">
      <IconButton><CopyIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Изменить документ">
      <IconButton onClick={() => {
        selectedRows.size && navigate(Array.from(selectedRows)[0]);
      }}><EditIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
