import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


const {classes: {PouchDB}, adapters: {pouch}} = $p;
const states = ['Отсутствует', 'Требует репликации', 'Актуальна', 'Реплицируется', 'Ошибка'];
const btns = ['Создать', 'Синхронизировать', 'Уничтожить', 'Синхронизировать', 'Создать'];

export default function ManageOffline() {
  const {local, remote} = pouch;
  const [info, setInfo] = React.useState(0);

  const handleDb = () => {
    const db = local.__doc || new PouchDB('doc', {adapter: 'indexeddb'});
    switch (info) {
      case 1:
        setInfo(3);
        db.replicate.from(remote.doc)
          .then(() => db.replicate.to(remote.doc))
          .then(() => setInfo(2))
          .catch((err) => {
            setInfo(4);
          });
    }
  };

  React.useEffect(() => {
    const db = local.__doc || new PouchDB('doc', {adapter: 'indexeddb'});
    if(!local.__doc && (pouch.props._auth_provider === 'offline' || navigator.onLine)) {
      local.__doc = db;
    }
    db.info().then((idb) => {
      remote.doc.info().then((cou) => {
        setInfo(cou.update_seq === idb.update_seq ? 2 : 1);
        if(db !== local.__doc) {
          db.close();
        }
      });
    });
  }, []);

  return <>
    <Typography sx={{mt: 2}} variant="h6">Управление автономным режимом:</Typography>
    <Typography>База offline: <i>{states[info]}</i></Typography>
    <Stack direction="row" justifyContent="flex-end" spacing={1} mt={1} mb={1}>
      <Button onClick={handleDb} disabled={info === 3}>{`${btns[info]} базу`}</Button>

    </Stack>
  </>;
}
