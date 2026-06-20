import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InsertsObj from '../inserts/Obj';

const FrmObj = ({mgr, obj, handlers}) => {
  switch (mgr.class_name) {
    case 'cat.inserts':
      return <InsertsObj obj={obj} onClose={handlers.habdleClose}/>;
    default:
      return 'FrmObj';
  }
};

function CompositeOrigin(composite, setOrigin) {

  function Detail(raw) {
    const [type, ref, rNum] = raw.split('|');
    const mgr = $p.cat[type.startsWith('ins') ? 'inserts' : (type.startsWith('f') ? 'furns' :
      (type === 'isl' ? 'insert_bind' : 'cnns'))];
    const origin = mgr.get(ref);
    if(origin.is_new()) {
      return null;
    }
    const row = origin.specification?.get?.(rNum - 1);
    return <ListItem button onClick={() => setOrigin({composite, obj: origin, presentation: origin.presentation})}>
      <ListItemAvatar>
        <Avatar>{type === 'isl' ? 'B' : type[0].toUpperCase()}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={origin.name} secondary={row ? `Строка №${rNum}, ${row.nom.name}` : 'Привязка вставок'} />
    </ListItem>;
  }

  return <List>{composite.map(Detail)}</List>;
}

function BlankOrigin() {
  const [refresh, setRefresh] = React.useState(0);
  const {debug} = $p.job_prm;
  return <>
    <Typography variant="h5">Происхождение не заполнено</Typography>
    <Typography sx={{mb: 2}}>Вероятно, в момент расчёта, был сброшен флаг отладки</Typography>
    {debug ? <Typography>Пересчитайте изделие</Typography> :
      <Button onClick={() => {
        $p.job_prm.debug = true;
        setRefresh(refresh + 1);
      }}>Установить 'job_prm.debug = true'</Button>}
  </>;
}

export default function FrmOrigin({origin, setOrigin}) {
  if(typeof origin === 'string') {
    return origin.startsWith('[') ? CompositeOrigin(JSON.parse(origin), setOrigin) : <BlankOrigin/>;
  }
  else {
    const {composite, obj} = origin;
    return <FrmObj
      mgr={obj._manager}
      acl="r"
      obj={obj}
      handlers={{habdleClose() {setOrigin(JSON.stringify(composite))}}}
    />
  }
}
