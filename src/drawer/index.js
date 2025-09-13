
import React from 'react';
import Loading from '../aggregate/App/Loading';
import BuilderContextProvider, {useBuilderContext} from './Context';
const BuilderFrame = React.lazy(() => import('./Builder/Frame'));

export default function Builder(props) {

  return <BuilderContextProvider>
    <React.Suspense fallback={<Loading/>}>
      <BuilderFrame useBuilderContext={useBuilderContext} {...props} />
    </React.Suspense>
  </BuilderContextProvider>;
}
