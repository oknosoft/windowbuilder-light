import * as React from 'react';
import {RouterProvider} from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Helmet from 'react-helmet';
import {router} from './Router';
import Loading from './Loading';

import {initialTitle, TitleContext} from './titleContext';
import {BackdropContext} from './backdropContext';
const bsx = { color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 };

export default function AppView(props) {
  const [{description, title, appTitle}, setTitleState] = React.useState(initialTitle);
  const [backdropOpen, setBackdropState] = React.useState(false);

  const setTitle = React.useMemo(() => (newState) => {
    setTitleState(prevState => ({...prevState, ...newState}));
  }, []);

  const setBackdrop = React.useMemo(() => (newOpen) => {
    setBackdropState(newOpen);
    return Promise.resolve();
  });

  return <TitleContext.Provider value={{ description, title, appTitle, setTitle }}>
    <Helmet title={title}/>
    <Backdrop sx={bsx} open={backdropOpen}>
      <CircularProgress color="inherit" />
    </Backdrop>
    <BackdropContext.Provider value={{ open: backdropOpen, setOpen: setBackdrop}}>
      <RouterProvider router={router} fallbackElement={<Loading />} />
    </BackdropContext.Provider>
  </TitleContext.Provider>;
}
