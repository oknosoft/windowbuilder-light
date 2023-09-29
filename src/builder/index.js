
import React from 'react';
import BuilderContextProvider, {useBuilderContext} from './Context';
import BuilderFrame from './BuilderFrame';

export default function Builder() {
  return <BuilderContextProvider>
    <BuilderFrame useBuilderContext={useBuilderContext} />
  </BuilderContextProvider>;
}
