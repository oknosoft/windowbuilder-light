import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
//import DataObj from 'metadata-react/FrmObj/DataObj';

const FrmObj = () => {
  return 'FrmObj';
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
    return <ListItem button onClick={() => setOrigin(origin)}>
      <ListItemAvatar>
        <Avatar>{type === 'isl' ? 'B' : type[0].toUpperCase()}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={origin.name} secondary={row ? `Строка №${rNum}, ${row.nom.name}` : 'Привязка вставок'} />
    </ListItem>;
  }

  return <List>{composite.map(Detail)}</List>;
}

export default function FrmOrigin({origin, setOrigin}) {
  if(typeof origin === 'string' && origin.startsWith('[')) {
    return CompositeOrigin(JSON.parse(origin), setOrigin);
  }
  else {
    return <FrmObj
      _mgr={origin._manager}
      _acl="r"
      match={{params: {ref: origin.ref}}}
      handlers={{}}
    />
  }
}
