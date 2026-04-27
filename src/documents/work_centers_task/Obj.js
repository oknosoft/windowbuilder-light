
import React from 'react';
import Typography from '@mui/material/Typography';
import {useParams, unstable_usePrompt as usePrompt} from 'react-router'; // https://www.npmjs.com/package/react-router-prompt
import {useTitleContext, useBackdropContext} from '../../aggregate/App';
import Loading from '../../aggregate/App/Loading';
import {Root} from '../../aggregate/Toolbars/styled';
import ObjToolbar from '../../aggregate/Toolbars/ObjToolbar';
import ObjTabs from '../../aggregate/FrmObj/ObjTabs';
import ObjHead from './ObjHead';
import ObjPlan from './ObjRegistry';
import ObjCutsIn from './ObjCutsIn';
import ObjCutsOut from './ObjCutsOut';
import ObjCutting from './ObjCutting';
import {ObjSetting, key, setting as initSetting} from './ObjSetting';

const {doc: {work_centers_task: mgr}, wsql, utils} = $p;

export default function WorkCentersTaskObj({ref}) {

  const [obj, setObj] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [tab, setTab] = React.useState(0);
  const tabRef = React.useRef(null);
  const [modified, setModified] = React.useState(false);
  const [settingOpen, setSettingOpen] = React.useState(false);
  const selSel = React.useState(null);
  const [setting, setSetting] = React.useState(initSetting);
  const saveSetting = (setting) => {
    wsql.set_user_param(key, setting);
    setSetting(setting);
  };

  const params = useParams();
  const {setTitle} = useTitleContext();
  const {setBackdrop} = useBackdropContext();
  if(!ref) {
    ref = params.ref;
  }

  React.useEffect(() => {
    (utils.prm().modified === 'false' ?
      Promise.resolve(function(doc) {doc._data._loading = false; return doc;}(mgr.get(ref))) :
      mgr.get(ref, 'promise'))
      .then((doc) => {
        const refs = new Set();
        for(const {calc_order} of doc.set) {
          if(calc_order.is_new()) {
            refs.add(calc_order.ref);
          }
        }
        const {adapters: {pouch}, doc: {calc_order}} = $p;
        return pouch.load_array(calc_order, Array.from(refs), false, pouch.remote.doc)
          .then(() => doc.load_keys())
          .then(() => doc.load_linked_refs())
          .catch((err) => {
            console.error(err);
            return doc;
          });
      })
      .then(setObj)
      .catch(setError)
      .then(() => setBackdrop(false));
  }, [ref]);

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
    {curr.name === 'planning' && <ObjPlan obj={obj} tabRef={tabRef} setBackdrop={setBackdrop}/>}
    {curr.name === 'cuts_in' && <ObjCutsIn obj={obj} tabRef={tabRef} setBackdrop={setBackdrop} selSel={selSel}/>}
    {curr.name === 'cuts_out' && <ObjCutsOut obj={obj} tabRef={tabRef} setBackdrop={setBackdrop} selSel={selSel}/>}
    {curr.name === 'cutting' && <ObjCutting obj={obj} tabRef={tabRef} setBackdrop={setBackdrop} selSel={selSel}/>}
    {settingOpen && <ObjSetting setSettingOpen={setSettingOpen} />}
  </Root>;
}
