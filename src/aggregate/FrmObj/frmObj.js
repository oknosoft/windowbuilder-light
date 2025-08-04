import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useTitleContext, useBackdropContext} from '../App';
import {useParams, unstable_usePrompt as usePrompt} from 'react-router'; // https://www.npmjs.com/package/react-router-prompt

const {wsql, job_prm} = $p;

export default function frmObj({initSetting}) {

  const [obj, setObj] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [tab, setTab] = React.useState(initSetting.tab || 0);
  const tabRef = React.useRef(null);
  const [modified, setModified] = React.useState(false);
  const [settingOpen, setSettingOpen] = React.useState(false);
  const [setting, setSetting] = React.useState(initSetting);
  const saveSetting = (setting) => {
    wsql.set_user_param(key, setting);
    setSetting(setting);
  };

  const params = useParams();
  const {setTitle} = useTitleContext();
  const {setBackdrop} = useBackdropContext();

  return {
    obj, setObj,
    error, setError,
    tab, setTab, tabRef,
    modified, setModified,
    settingOpen, setSettingOpen,
    setting, saveSetting,
    params, usePrompt, setTitle, setBackdrop,
  };
}

export function jsVersion(setError) {
  job_prm.version.check().then((ok) => {
    if(!ok) {
      setError({message: <Box sx={{p: 1}}>
          <Typography variant={"h5"}>Код программы обновлен на сервере</Typography>
          <Typography>Для продолжения работы, <a href="#" onClick={() => location.reload()}>перезагрузите страницу</a></Typography>
        </Box>});
    }
  });
}
