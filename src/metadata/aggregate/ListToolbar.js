import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/DriveFileRenameOutline';
import Typography from '@mui/material/Typography';
import {Toolbar, HtmlTooltip} from '../../components/App/styled';
import SearchField from '../cat/scheme_settings/Selection/Search';

export default function ListToolbar({create, clone, open, disabled, scheme, setRefresh}) {

  return <Toolbar disableGutters disabled={disabled}>
    <HtmlTooltip title="Создать документ {Insert}">
      <IconButton onClick={create}><AddIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Создать документ копированием текущего {F9}">
      <IconButton disabled={!clone} onClick={clone}><CopyIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Изменить документ">
      <IconButton onClick={open}><EditIcon/></IconButton>
    </HtmlTooltip>
    <Typography sx={{flex: 1}}></Typography>
    <SearchField scheme={scheme} setRefresh={setRefresh} />
  </Toolbar>;
}
