import React from 'react';
import {styled} from '@mui/material/styles';
import MuiToolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';

const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  backgroundColor: theme.palette.grey["50"],
}));

export default function ListToolbar() {
  return <Toolbar disableGutters ml={1}>
    <IconButton><AddIcon/></IconButton>
    <IconButton><CopyIcon/></IconButton>
    <IconButton><EditIcon/></IconButton>
  </Toolbar>;
}
