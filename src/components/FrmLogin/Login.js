import React from 'react';
import Typography from '@mui/material/Typography';
import Autocomplete from '../DataField/Autocomplete';
import Provider from './Provider';
import Creditales from './Creditales';
import {LoginRoot} from './Root';
import {abonentInit, abonentDeps} from './initLogin';
import {useTitleContext} from '../App';

const title = {title: 'Авторизация', appTitle: <Typography variant="h6" noWrap>Авторизация</Typography>};
export default function Login({pfilter}) {
  const [[abonent, abonentOptions], setAbonent] = React.useState([null, []]);
  const [[branch, branchesOptions], setBranch] = React.useState([null, []]);
  const [[provider, providers], setProvider] = React.useState(['', []]);
  const [yearState, setYear] = React.useState([new Date().getFullYear(), [new Date().getFullYear()]]);
  const [year, years] = yearState;
  const [[login, password], loginChange] = React.useState(['', '']);
  const {setTitle} = useTitleContext();

  React.useEffect(() => {
    abonentInit({setAbonent, setProvider, pfilter});
    setTitle(title);
  }, []);
  React.useEffect(() => abonentDeps({setBranch, setYear, yearState, abonent}), [abonent]);

  const abonentChange = (event, value) => setAbonent(([old, options]) => [value, options]);
  const branchChange = (event, value) => setBranch(([old, options]) => [value, options]);
  const yearChange = (event, value) => setYear(([old, options]) => [value, options]);
  const providerChange = (event, value) => {
    setProvider(([old, options]) => [value.value, options]);
  };

  const handleLogin = () => {
    return $p.adapters.pouch.log_in(login, password);
  };

  return <LoginRoot>
    <Typography variant="h6" sx={{paddingBottom: 1}}>Для доступа к данному разделу, необходима авторизация</Typography>
    <Autocomplete options={abonentOptions} value={abonent} onChange={abonentChange} label="Абонент" fullWidth/>
    <Autocomplete options={years} value={year} onChange={yearChange} label="Год" title="База архива" fullWidth/>
    <Autocomplete
      options={branchesOptions}
      value={branch}
      onChange={branchChange}
      label="Отдел"
      title="Отдел абонента"
      fullWidth
      readOnly={!branchesOptions.length}
    />
    <Provider options={providers} value={provider} providerChange={providerChange}/>
    <Creditales provider={provider} login={login} password={password} loginChange={loginChange} handleLogin={handleLogin}/>
  </LoginRoot>;
}
