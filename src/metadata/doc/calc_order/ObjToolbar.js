import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from 'react-router-dom';
import {Toolbar, ListSubheader} from './styled';

export default function ListToolbar({obj}) {
  const navigate = useNavigate();

  return <ListSubheader>
    <Toolbar disableGutters>
      <IconButton><SaveIcon/></IconButton>
      <IconButton><SaveAsIcon/></IconButton>
      <Typography sx={{flex: 1}}></Typography>
      <IconButton onClick={() => navigate(`/doc/calc_order${obj?.ref ? `?ref=${obj?.ref}` : ''}`)}><CloseIcon/></IconButton>
    </Toolbar>
  </ListSubheader>;
}
