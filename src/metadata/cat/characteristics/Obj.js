import React from 'react';
import Typography from '@mui/material/Typography';
import frmObj from '../../aggregate/frmObj';
import {Root} from '../../aggregate/styled';
import ObjToolbar from '../../aggregate/ObjToolbar';
import ObjTabs from '../../aggregate/ObjTabs';
import Loading from '../../../components/App/Loading';
import {key, setting as initSetting} from './ObjSetting';
import ObjSpecification from './ObjSpecification';

const {characteristics: mgr} = $p.cat;

export default function CharacteristicObj(props) {

  const {
    obj, setObj,
    error, setError,
    tab, setTab, tabRef,
    modified, setModified,
    settingOpen, setSettingOpen,
    setting, saveSetting,
    params, usePrompt, setTitle, setBackdrop,
  } = frmObj({initSetting});

  React.useEffect(() => {
    const {ref} = params;
    Promise.resolve().then(() => mgr.get(ref, 'promise'))
      .then((doc) => doc.load_linked_refs())
      .then(setObj)
      .catch(setError)
      .then(() => setBackdrop(false));
  }, []);

  React.useEffect(() => {
    const title = obj ? obj.presentation : 'Характеристика';
    setTitle({title, appTitle: <Typography variant="h6" noWrap>{title}</Typography>});
  }, [obj, modified]);

  const curr = setting.tabs.filter(({visible}) => visible)[tab];

  return obj ? <Root>
      <ObjToolbar obj={obj} mgr={mgr} setSettingOpen={setSettingOpen} />
      <ObjTabs ref={tabRef} tab={tab} setTab={setTab} setting={setting}/>
      {
        curr?.name === 'specification' ?
          <ObjSpecification obj={obj} tabRef={tabRef} /> :
          <Typography>{`${curr?.name} - не реализовано`}</Typography>
      }
    </Root>
    :
    <Loading>
      <Typography>Загрузка шаблонов...</Typography>
    </Loading>;
}
