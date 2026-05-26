
import React from 'react';
import Typography from '@mui/material/Typography';
import {useParams, unstable_usePrompt as usePrompt} from 'react-router'; // https://www.npmjs.com/package/react-router-prompt
import {useTitleContext, useBackdropContext} from '../../aggregate/App';
import Loading from '../../aggregate/App/Loading';
import {Root} from '../../aggregate/Toolbars/styled';
import ObjToolbar from '../../aggregate/Toolbars/ObjToolbar';
import ObjHead from './ObjHead';
import ObjNom from './ObjNom';
import {ObjSetting, key, setting as initSetting} from './ObjSetting';

const {doc: {inventory_cuts: mgr}, wsql, utils, current_user, job_prm} = $p;

export default function InventoryCutsObj() {

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
          const {responsible, work_center, transactions_kind} = doc;
          if(responsible.empty()) {
            doc.responsible = current_user;
          }
          if(work_center.empty()) {
            doc.work_center = job_prm.planning.main_work_center;
          }
          if(transactions_kind.empty()) {
            doc.transactions_kind = transactions_kind._manager.current;
          }
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
    const title = obj ? obj.presentation : 'Инвентаризация обрези';
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
    <ObjNom obj={obj} tabRef={tabRef} setBackdrop={setBackdrop}/>
    {settingOpen && <ObjSetting setSettingOpen={setSettingOpen} />}
  </Root>;
}
