import React from 'react';
import Typography from '@mui/material/Typography';
import Autocomplete from 'metadata-ui/DataField/Autocomplete';
import Provider from './Provider';
import {LoginRoot} from './Root';
import {abonentInit, abonentDeps} from './initLogin';
import {useTitleContext} from '../App';
import {useLoadingContext} from '../Metadata';
import ManageOffline from './Offline';

export default function Profile({pfilter, ...props}) {

  const [[abonent, abonentOptions], setAbonent] = React.useState([null, []]);
  const [[branch, branchesOptions], setBranch] = React.useState([null, []]);
  const [[provider, providers], setProvider] = React.useState(['', []]);
  const [yearState, setYear] = React.useState([new Date().getFullYear(), [new Date().getFullYear()]]);
  const [year, years] = yearState;
  const [[login, password], loginChange] = React.useState(['', '']);
  const {setTitle} = useTitleContext();
  const {handleIfaceState, ifaceState: {user, page, common_loaded, server_error}} = useLoadingContext();

  const {current_user, userOptions} = $p;
  const [title, meta] = React.useMemo(() => {
    return [
      {title: 'Профиль', appTitle: <Typography variant="h6" noWrap>{current_user.name}</Typography>},
      [current_user],
    ];
  }, [current_user]);

  React.useEffect(() => {
    common_loaded && abonentInit({setAbonent, setProvider, pfilter});
    setTitle(title);
  }, [common_loaded]);
  React.useEffect(() => abonentDeps({setBranch, setYear, yearState, abonent}), [abonent]);

  return <LoginRoot>
    <Autocomplete options={abonentOptions} value={abonent} label="Абонент" fullWidth readOnly/>
    <Autocomplete options={years} value={year} label="Год" title="База архива" fullWidth readOnly/>
    <Autocomplete options={branchesOptions} value={branch} label="Отдел" title="Отдел абонента" fullWidth readOnly/>
    <Provider options={providers} value={provider} readOnly/>
    <Autocomplete options={userOptions} value={current_user} label="Пользователь" title="Текущий пользователь" fullWidth readOnly/>
    <ManageOffline />
  </LoginRoot>;
}
