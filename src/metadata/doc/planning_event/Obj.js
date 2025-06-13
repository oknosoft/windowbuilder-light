
import React from 'react';
import Typography from '@mui/material/Typography';
import {useParams, unstable_usePrompt as usePrompt} from 'react-router'; // https://www.npmjs.com/package/react-router-prompt
import {useTitleContext, useBackdropContext} from '../../../components/App';
import Loading from '../../../components/App/Loading';
import {Root} from '../../aggregate/styled';
import ObjToolbar from '../../aggregate/ObjToolbar';
import ObjHead from './ObjHead';
import ObjPlan from '../work_centers_task/ObjRegistry';
import {ObjSetting, key, setting as initSetting} from './ObjSetting';

const {doc: {planning_event: mgr}, wsql, utils} = $p;

export default function PlanningEventObj() {

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
    const searchParams = utils.prm();
    if(searchParams.modified === 'false') {
      setObj(mgr.get(ref));
      setBackdrop(false);
    }
    else {
      mgr.get(ref, 'promise')
        .then((doc) => {
          return doc.load_linked_refs()
            .catch((err) => {
              console.error(err);
              return doc;
            });
        })
        .then(setObj)
        .catch(setError)
        .then(() => setBackdrop(false));
    }
  }, []);
  React.useEffect(() => {
    const title = obj ? obj.presentation : 'Событие планирования';
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
    <div ref={tabRef} />
    <ObjPlan obj={obj} tabRef={tabRef} setBackdrop={setBackdrop}/>
    {settingOpen && <ObjSetting setSettingOpen={setSettingOpen} />}
  </Root>;
}
