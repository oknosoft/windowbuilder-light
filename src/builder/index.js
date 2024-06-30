
import React from 'react';
import {useLoadingContext} from '../aggregate/Metadata';
import Loading from '../aggregate/App/Loading';
import BuilderContextProvider, {useBuilderContext} from './Context';
const BuilderFrame = React.lazy(() => import('./BuilderFrame'));

export default function Builder() {
  const {ifaceState} = useLoadingContext();
  return ifaceState.complete_loaded ? <BuilderContextProvider>
    <BuilderFrame useBuilderContext={useBuilderContext} />
  </BuilderContextProvider> : <Loading>Загрузка справочников...</Loading>;
}
