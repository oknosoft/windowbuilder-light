import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import {Toolbar} from '../../../components/App/styled';
export default function ListToolbar({selectedRows}) {
  const navigate = useNavigate();
  return <Toolbar disableGutters>
    <IconButton><AddIcon/></IconButton>
    <IconButton><CopyIcon/></IconButton>
    <IconButton onClick={() => {
      selectedRows.size && navigate(Array.from(selectedRows)[0]);
    }}><EditIcon/></IconButton>
  </Toolbar>;
}
