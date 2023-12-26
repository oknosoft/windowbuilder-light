import React from 'react';
import Typography from '@mui/material/Typography';
import {useParams, unstable_usePrompt as usePrompt} from 'react-router-dom'; // https://www.npmjs.com/package/react-router-prompt
import {useTitleContext, useBackdropContext} from '../../../components/App';
import Loading from '../../../components/App/Loading';
import {Root} from '../../_common/styled';
import ObjToolbar from '../../_common/ObjToolbar';
import ObjHead from './ObjHead';
import ObjTabs from '../../_common/ObjTabs';
import ObjProduction from './ObjProduction';
import ObjGlasses from './glasses/ObjGlasses';
import {ObjSetting, key, setting as initSetting} from './ObjSetting';

const stubDb = {
  allDocs() {
    return Promise.resolve({rows: []});
  },
  get() {
    return Promise.resolve({});
  },
  bulkDocs() {
    return Promise.resolve([]);
  },
  query() {
    return Promise.resolve({rows: []});
  }
};

const {doc: {calc_order: mgr}, wsql, job_prm} = $p;

export default function CalcOrderObj() {

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
    let res = Promise.resolve();
    if(job_prm.builder.glasses_template.is_new()) {
      for(const doc of mgr) {
        if(doc.obj_delivery_state.is('Шаблон')) {
          res = res.then(() => doc.load_templates());
        }
      }
    }
    res = res.then(() => mgr.get(ref, 'promise'))
      .then((doc) => doc.load_linked_refs())
      .then(setObj)
      .catch(setError)
      .then(() => setBackdrop(false));
  }, []);
  React.useEffect(() => {
    const title = obj ? obj.presentation : 'Расчёт-заказ';
    setTitle({title, appTitle: <Typography variant="h6" noWrap>{title}</Typography>});
  }, [obj, modified]);

  usePrompt({
    when: modified,
    message: 'Документ изменён -- закрыть без сохранения?'
  });

  //useBeforeUnload(update);
  //
  React.useEffect(function prompt() {
    function update (curr, flds){
      if(!modified && (curr === obj || curr?._owner?._owner === obj)) {
        if(flds?.production) {
          obj.before_save({db: stubDb});
        }
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
    return <Loading>
      <Typography>Загрузка...</Typography>
    </Loading>;
  }

  const curr = setting.tabs.filter(({visible}) => visible)[tab];

  return <Root>
    <ObjToolbar obj={obj} mgr={mgr} setSettingOpen={setSettingOpen} />
    <ObjHead obj={obj} setting={setting}/>
    <ObjTabs ref={tabRef} tab={tab} setTab={setTab} setting={setting}/>
    {curr.name === 'all' && <ObjProduction tabRef={tabRef} obj={obj}/>}
    {curr.name === 'glass' && <ObjGlasses tabRef={tabRef} obj={obj} setModified={setModified}/>}
    {settingOpen && <ObjSetting setSettingOpen={setSettingOpen} />}
  </Root>;
}
