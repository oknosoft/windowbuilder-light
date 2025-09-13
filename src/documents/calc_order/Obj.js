import React from 'react';
import Typography from '@mui/material/Typography';
import {Routes, Route} from 'react-router';
import frmObj, {jsVersion} from '../../aggregate/FrmObj/frmObj';
import {Root} from '../../aggregate/Toolbars/styled';
import ObjToolbar from '../../aggregate/Toolbars/ObjToolbar';
import RecalcBtn from './RecalcBtn';
import SendBtn from './SendBtn';
import Loading from '../../aggregate/App/Loading';
import ObjHead from './ObjHead';
import ObjTabs from '../../aggregate/FrmObj/ObjTabs';
import ObjProduction from './ObjProduction';
import ObjNom from './ObjNom';
import ObjGlasses from './glasses/ObjGlasses';
import {ObjSetting, key, setting as initSetting} from './ObjSetting';
import Drawer from '../../drawer';

const {doc: {calc_order: mgr}, job_prm, current_user} = $p;

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
  const isBuilder = params['*']?.includes('builder/');
  React.useEffect(() => {
    let res = Promise.resolve();
    if(job_prm.builder.glasses_template?.is_new?.()) {
      job_prm.builder.glasses_template.obj_delivery_state = 'Шаблон';
      res = job_prm.builder.glasses_template.load()
        .then((template) => {
          return template.calc_order.load_templates();
        });
      // for(const doc of mgr) {
      //   if(doc.obj_delivery_state.is('Шаблон')) {
      //     res = res.then(() => doc.load_templates());
      //   }
      // }
    }
    res = res.then(() => mgr.get(ref, 'promise'))
      .then((doc) => doc.load_linked_refs())
      .then((doc) => {
        setObj(doc);
        setModified(doc._modified);
      })
      .catch(setError)
      .then(() => setBackdrop(false));

    jsVersion(setError);
  }, [ref]);

  React.useEffect(() => {
    if(!isBuilder) {
      let title = obj ? obj.presentation : 'Расчёт-заказ';
      if(obj?.is_read_only) {
        title += ' /Только просмотр/';
      }
      setTitle({title, appTitle: <Typography variant="h6" noWrap>{title}</Typography>});
    }
  }, [obj, modified, isBuilder]);

  usePrompt({
    when: modified,
    message: 'Документ изменён -- закрыть без сохранения?'
  });

  //useBeforeUnload(update);
  //
  React.useEffect(function onMount() {
    function update (curr, flds){
      if(!modified && (curr === obj || curr?._owner?._owner === obj)) {
        if(curr === obj && flds && 'contract' in flds) {
          for(const row of obj.production) {
            if(row.characteristic.calc_order === obj && row.characteristic.base_block === job_prm.builder.glasses_template)
              obj._data.chrows.add(row);
          }
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

  return <Routes>
    <Route path="builder/:ref" element={<Drawer obj={obj} />} />
    <Route path="*" element={
      <Root>
        <ObjToolbar
          obj={obj}
          mgr={mgr}
          setSettingOpen={setSettingOpen}
          setBackdrop={setBackdrop}
          btns={<RecalcBtn obj={obj} setBackdrop={setBackdrop}/>}
          postBtns={SendBtn({obj, setBackdrop})}
          readOnly={obj.is_read_only}
          disablePost={!current_user.role_available('СогласованиеРасчетовЗаказов')}
          modified={modified}
          setModified={setModified}
        />
        <ObjHead obj={obj} setting={setting} setBackdrop={setBackdrop}/>
        <ObjTabs ref={tabRef} tab={tab} setTab={setTab} setting={setting}/>
        {curr.name === 'all' && <ObjProduction tabRef={tabRef} obj={obj}/>}
        {curr.name === 'nom' && <ObjNom tabRef={tabRef} obj={obj} setModified={setModified}/>}
        {curr.name === 'glass' && <ObjGlasses tabRef={tabRef} obj={obj} setModified={setModified}/>}
        {settingOpen && <ObjSetting setSettingOpen={setSettingOpen} />}
      </Root>
    } />
  </Routes>;
}
