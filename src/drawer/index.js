
import React from 'react';
import Loading from '../aggregate/App/Loading';
import BuilderContextProvider, {useBuilderContext} from './Context';
const BuilderFrame = React.lazy(() => import('./Frame'));

export default function Builder() {
  return <BuilderContextProvider>
    <React.Suspense fallback={<Loading/>}>
      <BuilderFrame useBuilderContext={useBuilderContext} />
    </React.Suspense>
  </BuilderContextProvider>;
}
