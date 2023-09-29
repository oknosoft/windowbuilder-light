import React from 'react';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import CloseIcon from '@mui/icons-material/Close';
import CalculateIcon from '@mui/icons-material/Calculate';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import {useNavigate} from 'react-router-dom';
import {HtmlTooltip} from '../../_common/App/styled';
import {useLoadingContext} from '../../_common/Metadata';

export default function MainToolbar() {
  const navigate = useNavigate();
  const {close, recalc, save, saveClose} = React.useMemo(() => {
    const close = () => navigate(`/`);
    const recalc = () => null;
    const save = () => null;
    const saveClose = () => null;
    return {close, recalc, save, saveClose};
  }, []);

  const {ifaceState: {drawerOpen}} = useLoadingContext();

  return <>
    {drawerOpen ? null : <Divider orientation="vertical" sx={{mr: 1}} flexItem />}
    <HtmlTooltip title="Записать и закрыть">
      <IconButton onClick={saveClose}><SaveIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Записать">
      <IconButton onClick={save}><SaveAsIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Пересчитать">
      <IconButton onClick={recalc}><CalculateIcon/></IconButton>
    </HtmlTooltip>
    <Divider orientation="vertical" sx={{mx: 1}} flexItem />
    <HtmlTooltip title="Загрузить из шаблона">
      <IconButton onClick={recalc}><ArchitectureIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Скопировать в буфер обмена">
      <IconButton onClick={recalc}><CopyAllIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Загрузить из буфера обмена">
      <IconButton onClick={recalc}><ContentPasteGoIcon/></IconButton>
    </HtmlTooltip>
    <Typography sx={{flex: 1}}></Typography>
    <HtmlTooltip title="Закрыть редактор">
      <IconButton onClick={close}><CloseIcon/></IconButton>
    </HtmlTooltip>
  </>;
}
