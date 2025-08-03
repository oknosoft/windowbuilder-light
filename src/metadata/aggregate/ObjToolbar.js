import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SettingsIcon from '@mui/icons-material/DisplaySettings';
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from 'react-router';
import {ListSubheader} from './styled';
import {Toolbar, HtmlTooltip} from '../../components/App/styled';
import PostBtn from './PostBtn';
import MenuPrint from './MenuPrint';

const {utils, ui: {dialogs}} = $p;
export const alert = (err) => {
  if(typeof err === 'string' || err instanceof Error) {
    dialogs.alert({
      title: 'Ошибка записи',
      text: err?.message || err,
    });
  }
};

export default function ObjToolbar({obj, mgr, btns=null, postBtns=null, setSettingOpen, onClose, modified, setModified, readOnly, disablePost}) {
  const navigate = useNavigate();
  const {close, save, saveClose} = React.useMemo(() => {
    const close = (typeof onClose === 'function') ? onClose : () => {
      const searchParams = utils.prm();
      const url = searchParams.return || `/${mgr.class_name.replace('.', '/')}${obj?.ref ? `?ref=${obj.ref}` : ''}`;
      if(searchParams.modified === 'false' && (modified || obj._modified)) {
        setModified(false);
      }
      setTimeout(() => navigate(url == '-1' ? -1 : url));
    };
    const save = () => obj.save().catch(alert);
    const saveClose = () => obj.save().then(close).catch(alert);
    return {close, save, saveClose};
  }, [obj]);

  return <ListSubheader>
    <Toolbar disableGutters>
      <HtmlTooltip title="Записать и закрыть">
        <IconButton disabled={readOnly} onClick={saveClose}><SaveIcon/></IconButton>
      </HtmlTooltip>
      <HtmlTooltip title="Записать">
        <IconButton disabled={readOnly} onClick={save}><SaveAsIcon/></IconButton>
      </HtmlTooltip>
      <PostBtn obj={obj} onError={alert} readOnly={readOnly || disablePost} menuItems={postBtns}/>
      {btns && <Divider orientation="vertical" flexItem sx={{m: 1}} />}
      {btns}
      <Typography sx={{flex: 1}}></Typography>
      <HtmlTooltip title="печать">
        <MenuPrint
          mgr={mgr}
          obj={obj}
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
