import * as React from 'react';
import {RouterProvider} from 'react-router-dom';
import {router} from './Router';
import Loading from './Loading';

import {initialTitle, TitleContext} from './titleContext';

export default function AppView(props) {
  const [{description, title, appTitle}, setState] = React.useState(initialTitle);
  const setTitle = React.useMemo(() => (newState) => {
    setState(prevState => ({...prevState, ...newState}));
  }, []);

  return <TitleContext.Provider value={{ description, title, appTitle, setTitle }}>
    <RouterProvider router={router} fallbackElement={<Loading />} />
  </TitleContext.Provider>;
}
