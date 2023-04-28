import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SettingsIcon from '@mui/icons-material/DisplaySettings';
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from 'react-router-dom';
import {ListSubheader} from './styled';
import {Toolbar, HtmlTooltip} from '../../../components/App/styled';

export default function ObjToolbar({obj, setSettingOpen}) {
  const navigate = useNavigate();
  const close = () => navigate(`/doc/calc_order${obj?.ref ? `?ref=${obj?.ref}` : ''}`);
  const save = () => obj.save();
  const saveClose = () => obj.save().then(close);

  return <ListSubheader>
    <Toolbar disableGutters>
      <HtmlTooltip title="Записать и закрыть">
        <IconButton onClick={saveClose}><SaveIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Записать">
        <IconButton onClick={save}><SaveAsIcon/></IconButton>
      </HtmlTooltip>
      <Typography sx={{flex: 1}}></Typography>
      <HtmlTooltip title="Настроить форму">
        <IconButton onClick={() => setSettingOpen(true)}><SettingsIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Закрыть форму документа">
        <IconButton onClick={close}><CloseIcon/></IconButton>
      </HtmlTooltip>
    </Toolbar>
  </ListSubheader>;
}
