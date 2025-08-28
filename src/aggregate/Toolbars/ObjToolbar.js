import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SettingsIcon from '@mui/icons-material/DisplaySettings';
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from 'react-router';
import {useLoadingContext} from '../../aggregate/Metadata';
import {ListSubheader} from './styled';
import {Toolbar, HtmlTooltip} from '../App/styled';
import PostBtn from '../FrmObj/PostBtn';
import MenuPrint from './MenuPrint';
import UnmodidiedDialog, {queryModidied} from './Unmodidied';

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
  const {ifaceState: {innerWidth}} = useLoadingContext();
  const [confirmOpen, setConfirmOpen] = React.useState(null);
  const {close, save, saveClose, confirmClose} = React.useMemo(() => {
    const close = (typeof onClose === 'function') ? onClose : () => {
      const searchParams = utils.prm();
      const url = searchParams.return || `/${mgr.class_name.replace('.', '/')}${obj?.ref ? `?ref=${obj.ref}` : ''}`;
      if((searchParams.modified === 'false' || !obj._modified) && (modified || obj._modified)) {
        setModified(false);
      }
      setTimeout(() => navigate(url == '-1' ? -1 : url));
    };
    const saveFin = () => obj.save()
      .then(() => setModified(obj._modified))
      .catch(err => {
        alert(err);
        throw err;
      });
    const fin = () => null;
    const save = () => queryModidied({setConfirmOpen, saveFin, obj, action: 'save'}).catch(fin);
    const saveClose = () => queryModidied({setConfirmOpen, saveFin, obj, action: 'close'}).then(close).catch(fin);
    const confirmClose = () => setConfirmOpen(null);
    return {close, save, saveClose, confirmClose};
  }, [obj]);

  const actText = obj.posted ? 'Провести' : 'Записать';
  const useButton = innerWidth > 640;

  return <ListSubheader>
    <Toolbar disableGutters>
      {useButton ? <Button disabled={readOnly} onClick={saveClose}>{`${actText} и закрыть`}</Button> :
        <HtmlTooltip title={`${actText} и закрыть`}>
          <IconButton disabled={readOnly} onClick={saveClose}><SaveIcon/></IconButton>
        </HtmlTooltip>
      }
      {useButton ? <Button disabled={readOnly} onClick={save}>{actText}</Button> :
        <HtmlTooltip title={actText}>
          <IconButton disabled={readOnly} onClick={save}><SaveAsIcon/></IconButton>
        </HtmlTooltip>
      }
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
    {confirmOpen ? <UnmodidiedDialog
      confirmOpen={confirmOpen}
      confirmClose={confirmClose}
      actText={actText}
    /> : null}
  </ListSubheader>;
}
