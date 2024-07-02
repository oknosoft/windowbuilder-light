import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SettingsIcon from '@mui/icons-material/DisplaySettings';
import CloseIcon from '@mui/icons-material/Close';
import CalculateIcon from '@mui/icons-material/Calculate';
import {useNavigate} from 'react-router-dom';
import {ListSubheader} from './styled';
import {Toolbar, HtmlTooltip} from '../../components/App/styled';
import PostBtn from './PostBtn';
import MenuPrint from './MenuPrint';

const {utils} = $p;

export default function ObjToolbar({obj, mgr, setSettingOpen, modified, setModified}) {
  const navigate = useNavigate();
  const {close, recalc, save, saveClose} = React.useMemo(() => {
    const close = () => {
      const searchParams = utils.prm();
      const url = searchParams.return || `/${mgr.class_name.replace('.', '/')}${obj?.ref ? `?ref=${obj.ref}` : ''}`;
      if(searchParams.modified === 'false' && (modified || obj._modified)) {
        setModified(false);
      }
      setTimeout(() => navigate(url == '-1' ? -1 : url));
    };
    const recalc = () => obj.recalc();
    const save = () => obj.save();
    const saveClose = () => obj.save().then(close);
    return {close, recalc, save, saveClose};
  }, [obj]);

  return <ListSubheader>
    <Toolbar disableGutters>
      <HtmlTooltip title="Записать и закрыть">
        <IconButton onClick={saveClose}><SaveIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Записать">
        <IconButton onClick={save}><SaveAsIcon/></IconButton>
      </HtmlTooltip>
      <PostBtn obj={obj} />
      <Divider orientation="vertical" flexItem sx={{m: 1}} />
      <HtmlTooltip title="Пересчитать">
        <IconButton disabled onClick={recalc}><CalculateIcon/></IconButton>
      </HtmlTooltip>
      <Typography sx={{flex: 1}}></Typography>
      <HtmlTooltip title="печать">
        <MenuPrint
          mgr={mgr}
          handlePrint={(model) => {
            model.execute(obj);
          }}
          variant="button"
        />
      </HtmlTooltip>
      <HtmlTooltip title="Настроить форму">
        <IconButton onClick={() => setSettingOpen(true)}><SettingsIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Закрыть форму">
        <IconButton onClick={close}><CloseIcon/></IconButton>
      </HtmlTooltip>
    </Toolbar>
  </ListSubheader>;
}
