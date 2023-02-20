import * as React from 'react';
import {useTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {BrowserRouter, useNavigate} from 'react-router-dom';
import Drawer from './Drawer';
import Router from './Router';

import {Main, AppBar, Space, Root} from './styled';

const RootWithDrawer = ({menu_open, ...props}) => {

  const theme = useTheme();
  const sxColor = {
    backgroundColor: theme.palette.primary[50],
    color: theme.palette.primary.dark,
    boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%)',
  };

  const {handleIfaceState} = props;

  const handleDrawerOpen = () => {
    handleIfaceState({name: 'menu_open', value: true});
  };

  const handleDrawerClose = () => {
    handleIfaceState({name: 'menu_open', value: false});
  };

  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };

  props.handlers.handleNavigate = handleNavigate;

  return <Root>
    <CssBaseline />
    <AppBar menu_open={menu_open} handleDrawerOpen={handleDrawerOpen} sxColor={sxColor}/>
    <Drawer menu_open={menu_open} navigate={navigate} theme={theme} handleDrawerClose={handleDrawerClose} sxColor={sxColor}/>
    <Main open={menu_open}>
      <Space />
      <Router {...props} handleNavigate={handleNavigate} />
    </Main>
  </Root>;

}

export default function AppView(props) {
  return <BrowserRouter>
    <RootWithDrawer {...props} />
  </BrowserRouter>;
}
