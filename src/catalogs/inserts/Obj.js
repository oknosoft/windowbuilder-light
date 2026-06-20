import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from 'metadata-ui/DataField/Text';
import RefField from 'metadata-ui/DataField/RefField';
import frmObj from '../../aggregate/FrmObj/frmObj';
import ObjToolbar from '../../aggregate/Toolbars/ObjToolbar';
import Loading from '../../aggregate/App/Loading';
import {key, setting as initSetting} from './ObjSetting';

const {inserts: mgr} = $p.cat;

export default function InsertsObj({obj, onClose, ...props}) {

  const {
    error, setError,
    tab, setTab, tabRef,
    modified, setModified,
    settingOpen, setSettingOpen,
    setting, saveSetting,
    params, usePrompt, setTitle, setBackdrop,
  } = frmObj({initSetting});


  return obj ? <>
    <ObjToolbar obj={obj} mgr={mgr} setSettingOpen={setSettingOpen} onClose={onClose}/>
      <Grid container spacing={1} ml={1} mr={1}>
        <Grid size={{xs: 12, lg: 6}}>
          <TextField label="Наименование" value={obj.name} enterTab/>
          <TextField label="Артикул" value={obj.article} enterTab/>
          <TextField label="Код" value={obj.id} enterTab/>
        </Grid>
        <Grid size={{xs: 12, lg: 6}}>
          <RefField obj={obj} fld="insert_type" enterTab disabled/>
          <RefField obj={obj} fld="is_order_row" enterTab disabled/>
          <RefField obj={obj} fld="region" enterTab disabled/>
        </Grid>
      </Grid>
  </>
    :
    <Loading>
      <Typography>Чтение элемента...</Typography>
    </Loading>;
}
