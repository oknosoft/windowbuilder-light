import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from 'metadata-ui/App/Dialog';
import TextField from 'metadata-ui/DataField/Text';
import RefField from 'metadata-ui/DataField/RefField';
import Checkbox from 'metadata-ui/DataField/Checkbox';
import frmObj from '../../aggregate/FrmObj/frmObj';
import ObjToolbar from '../../aggregate/Toolbars/ObjToolbar';
import Loading from '../../aggregate/App/Loading';
import {key, setting as initSetting} from './ObjSetting';

const {contracts: mgr} = $p.cat;

export default function ContractsObj({obj, open, onClose, ...props}) {

  const {
    error, setError,
    tab, setTab, tabRef,
    modified, setModified,
    settingOpen, setSettingOpen,
    setting, saveSetting,
    params, usePrompt, setTitle, setBackdrop,
  } = frmObj({initSetting});


  return <Dialog
    open={open}
    onClose={onClose}
    title={<ObjToolbar obj={obj} mgr={mgr} setSettingOpen={setSettingOpen} onClose={onClose}/>}
    raw>
    {obj ? <Box sx={{p: 1, minWidth: 420}}>
        <RefField obj={obj} fld="organization" enterTab/>
        <RefField obj={obj} fld="owner" enterTab/>
        <TextField obj={obj} fld="name" enterTab/>
        <RefField obj={obj} fld="contract_kind" enterTab/>
        <RefField obj={obj} fld="mutual_settlements" enterTab/>
        <RefField obj={obj} fld="settlements_currency" enterTab/>
        <Checkbox obj={obj} fld="vat_consider"/>
        <Checkbox obj={obj} fld="vat_included"/>
        <TextField obj={obj} fld="note" enterTab/>
      </Box>
      :
      <Loading>
        <Typography>Чтение элемента...</Typography>
      </Loading>}
  </Dialog>;
}
