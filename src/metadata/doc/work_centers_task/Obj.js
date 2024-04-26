
import React from 'react';
import Typography from '@mui/material/Typography';
import {useParams, unstable_usePrompt as usePrompt} from 'react-router-dom'; // https://www.npmjs.com/package/react-router-prompt
import {useTitleContext, useBackdropContext} from '../../../components/App';
import Loading from '../../../components/App/Loading';
import {Root} from '../../aggregate/styled';
import ObjToolbar from '../../aggregate/ObjToolbar';
import ObjTabs from '../../aggregate/ObjTabs';
import ObjHead from './ObjHead';
import ObjPlan from './ObjPlan';
import ObjCutsIn from './ObjCutsIn';
import ObjCutsOut from './ObjCutsOut';
import ObjCutting from './ObjCutting';
import {ObjSetting, key, setting as initSetting} from './ObjSetting';

const {doc: {work_centers_task: mgr}, wsql} = $p;

export default function WorkCentersTaskObj() {

  const [obj, setObj] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [tab, setTab] = React.useState(0);
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

  React.useEffect(() => {
    const {ref} = params;
    mgr.get(ref, 'promise')
      .then((doc) => doc.load_linked_refs())
      .then(setObj)
      .catch(setError)
      .then(() => setBackdrop(false));
  }, []);
  React.useEffect(() => {
    const title = obj ? obj.presentation : 'Задание';
    setTitle({title, appTitle: <Typography variant="h6" noWrap>{title}</Typography>});
  }, [obj, modified]);

  usePrompt({
    when: modified,
    message: 'Документ изменён -- закрыть без сохранения?'
  });

  //
  React.useEffect(function prompt() {
    function update (curr, flds){
      if(!modified && (curr === obj || curr?._owner?._owner === obj)) {
        setModified(obj._modified);
      }
    }
    function beforeUnload (e) {
      if(modified || obj._modified) {
        e.preventDefault();
        return (e.returnValue = "");
      }
    }
    mgr.on({update, after_save: update, rows: update});
    addEventListener('beforeunload', beforeUnload);
    return () => {
      mgr.off({update, after_save: update, rows: update});
      removeEventListener('beforeunload', beforeUnload);
    };
  }, [obj]);

  if(error) {
    return error.message;
  }

  if(!obj) {
    return <Loading><Typography>Загрузка...</Typography></Loading>;
  }

  const curr = setting.tabs.filter(({visible}) => visible)[tab];

  return <Root>
    <ObjToolbar obj={obj} mgr={mgr} setSettingOpen={setSettingOpen} modified={modified} setModified={setModified}/>
    <ObjHead obj={obj} setting={setting}/>
    <ObjTabs ref={tabRef} tab={tab} setTab={setTab} setting={setting}/>
    {curr.name === 'planning' && <ObjPlan obj={obj} tabRef={tabRef} />}
    {curr.name === 'cuts_in' && <ObjCutsIn obj={obj} tabRef={tabRef} />}
    {curr.name === 'cuts_out' && <ObjCutsOut obj={obj} tabRef={tabRef} />}
    {curr.name === 'cutting' && <ObjCutting obj={obj} tabRef={tabRef} setBackdrop={setBackdrop} />}
    {settingOpen && <ObjSetting setSettingOpen={setSettingOpen} />}
  </Root>;
}
