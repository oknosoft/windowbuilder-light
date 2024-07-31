
import React from 'react';
import Typography from '@mui/material/Typography';
import {Navigate} from 'react-router-dom';
import {useLoadingContext} from '../aggregate/Metadata';
import Loading from '../aggregate/App/Loading';
import {Padding} from '../aggregate/App/styled';
import BuilderContextProvider, {useBuilderContext} from './Context';
const BuilderFrame = React.lazy(() => import('./BuilderFrame'));

export default function Builder() {
  const {ifaceState} = useLoadingContext();
  if(!ifaceState.common_loaded) {
    return <Loading>Подключение к серверу...</Loading>;
  }
  if(!ifaceState.user.logged_in) {
    const {pathname, search} = location;
    return <Navigate to={`/login?return=${pathname}${search}`} replace={true} />;
  }
  return ifaceState.complete_loaded ? <BuilderContextProvider>
    <BuilderFrame useBuilderContext={useBuilderContext} />
  </BuilderContextProvider> : <Loading>Загрузка справочников...</Loading>;
}
