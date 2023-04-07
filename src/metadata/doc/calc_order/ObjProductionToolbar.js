import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import {ListSubheader} from './styled';
import {Toolbar} from '../../../components/App/styled';

export default function ObjProductionToolbar({obj}) {

  return <ListSubheader>
    <Toolbar disableGutters>
      <IconButton><AddIcon/></IconButton>
      <IconButton><CopyIcon/></IconButton>
      <IconButton><EditIcon/></IconButton>
    </Toolbar>
  </ListSubheader>;
}
