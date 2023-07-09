import React from 'react';
import Typography from '@mui/material/Typography';
// https://www.npmjs.com/package/react-router-prompt
import {useParams, unstable_usePrompt as usePrompt} from 'react-router-dom';
import {useTitleContext, useBackdropContext} from '../../../components/App';
import Loading from '../../../components/App/Loading';
import {Root} from './styled';
import ObjToolbar from './ObjToolbar';
import ObjHead from './ObjHead';
import ObjTabs from './ObjTabs';
import ObjProduction from './ObjProduction';
import ObjGlasses from './glasses/ObjGlasses';
import {ObjSetting, key, setting as initSetting} from './ObjSetting';

export default function CalcOrderObj() {

  const [obj, setObj] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [tab, setTab] = React.useState(0);
  const tabRef = React.useRef(null);

  const [modified, setModified] = React.useState(false);

  const [settingOpen, setSettingOpen] = React.useState(false);
  const [setting, setSetting] = React.useState(initSetting);
  const saveSetting = (setting) => {
    $p.wsql.set_user_param(key, setting);
    setSetting(setting);
  };

  const params = useParams();
  const {setTitle} = useTitleContext();
  const {setBackdrop} = useBackdropContext();

  React.useEffect(() => {
    const {ref} = params;
    $p.doc.calc_order.get(ref, 'promise')
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
      if(!modified && (curr === obj || curr._owner._owner === obj)) {
        setModified(obj._modified);
      }
    }
    function beforeUnload (e) {
      if(modified || obj._modified) {
        e.preventDefault();
        return (e.returnValue = "");
      }
    }
    $p.doc.calc_order.on({update, after_save: update});
    addEventListener('beforeunload', beforeUnload);
    return () => {
      $p.doc.calc_order.off({update, after_save: update});
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
    <ObjToolbar obj={obj} setSettingOpen={setSettingOpen} />
    <ObjHead obj={obj} setting={setting}/>
    <ObjTabs ref={tabRef} tab={tab} setTab={setTab} setting={setting}/>
    {curr.name === 'all' && <ObjProduction tabRef={tabRef} obj={obj}/>}
    {curr.name === 'glass' && <ObjGlasses tabRef={tabRef} obj={obj} setModified={setModified}/>}
    {settingOpen && <ObjSetting setSettingOpen={setSettingOpen} />}
  </Root>;
}
