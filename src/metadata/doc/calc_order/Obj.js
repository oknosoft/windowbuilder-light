import React from 'react';
import Typography from '@mui/material/Typography';
import {useParams} from 'react-router-dom';
import {useTitleContext} from '../../../components/App';
import Loading from '../../../components/App/Loading';
import {Root} from './styled';
import ObjToolbar from './ObjToolbar';
import ObjHead from './ObjHead';
import ObjTabs from './ObjTabs';
import ObjProduction from './ObjProduction';

export default function CalcOrderObj() {

  const [obj, setObj] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [tab, setTab] = React.useState(0);
  const tabRef = React.useRef(null);

  const params = useParams();
  const {setTitle} = useTitleContext();



  React.useEffect(() => {
    const {ref} = params;
    $p.doc.calc_order.get(ref, 'promise')
      .then((doc) => doc.load_linked_refs())
      .then((doc) => {
        setObj(doc);
      })
      .catch((err) => setError(err));
  }, []);
  React.useEffect(() => {
    const title = obj ? obj.presentation : 'Расчёт-заказ';
    setTitle({title, appTitle: <Typography variant="h6" noWrap>{title}</Typography>});
  }, [obj?._modified]);

  if(error) {
    return error.message;
  }

  if(!obj) {
    return <Loading>
      <Typography>Загрузка...</Typography>
    </Loading>;
  }

  return <Root>
    <ObjToolbar obj={obj} />
    <ObjHead obj={obj}/>
    <ObjTabs ref={tabRef} tab={tab} setTab={setTab}/>
    {tab === 0 && <ObjProduction tabRef={tabRef} obj={obj}/>}
  </Root>;
}
