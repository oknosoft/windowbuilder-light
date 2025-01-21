import React from 'react';
import Typography from '@mui/material/Typography';
import frmObj, {jsVersion} from '../../aggregate/frmObj';
import {Root} from '../../aggregate/styled';
import ObjToolbar from '../../aggregate/ObjToolbar';
import RecalcBtn from './RecalcBtn';
import Loading from '../../../components/App/Loading';
import ObjHead from './ObjHead';
import ObjTabs from '../../aggregate/ObjTabs';
import ObjProduction from './ObjProduction';
import ObjNom from './ObjNom';
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

const {doc: {calc_order: mgr}, job_prm} = $p;

export default function CalcOrderObj() {

  const {
    obj, setObj,
    error, setError,
    tab, setTab, tabRef,
    modified, setModified,
    settingOpen, setSettingOpen,
    setting, saveSetting,
    params, usePrompt, setTitle, setBackdrop,
  } = frmObj({initSetting});

  const {ref} = params;
  React.useEffect(() => {
    let res = Promise.resolve();
    if(job_prm.builder.glasses_template?.is_new?.()) {
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

    jsVersion(setError);
  }, [ref]);

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
  React.useEffect(function onMount() {
    function update (curr, flds){
      if(!modified && (curr === obj || curr?._owner?._owner === obj)) {
        // if(flds?.production) {
        //   obj.before_save({db: stubDb});
        // }
        setModified(obj._modified);
      }
    }

    function beforeUnload (e) {
      if(modified || obj._modified) {
        e.preventDefault();
        return (e.returnValue = "");
      }
    }

    function before_save(curr) {
      if(curr === obj && obj._data.chrows.size) {
        return Promise.reject('Есть изменённые строки,\nвыполните пересчёт перед записью');
      }
    }

    mgr.on({update, after_save: update, rows: update, before_save});
    addEventListener('beforeunload', beforeUnload);
    return () => {
      mgr.off({update, after_save: update, rows: update, before_save});
      removeEventListener('beforeunload', beforeUnload);
    };
  }, [obj]);

  // в chrows будем хранить изменённые строки
  if(obj && !obj._data.chrows) {
    obj._data.chrows = new Set();
  }

  if(error) {
    return error.message;
  }

  if(!obj) {
    return <Loading>
      <Typography>Загрузка шаблонов...</Typography>
    </Loading>;
  }

  const curr = setting.tabs.filter(({visible}) => visible)[tab];

  return <Root>
    <ObjToolbar
      obj={obj}
      mgr={mgr}
      setSettingOpen={setSettingOpen}
      setBackdrop={setBackdrop}
      btns={<RecalcBtn obj={obj} setBackdrop={setBackdrop}/>}
    />
    <ObjHead obj={obj} setting={setting} setBackdrop={setBackdrop}/>
    <ObjTabs ref={tabRef} tab={tab} setTab={setTab} setting={setting}/>
    {curr.name === 'all' && <ObjProduction tabRef={tabRef} obj={obj}/>}
    {curr.name === 'nom' && <ObjNom tabRef={tabRef} obj={obj} setModified={setModified}/>}
    {curr.name === 'glass' && <ObjGlasses tabRef={tabRef} obj={obj} setModified={setModified}/>}
    {settingOpen && <ObjSetting setSettingOpen={setSettingOpen} />}
  </Root>;
}
