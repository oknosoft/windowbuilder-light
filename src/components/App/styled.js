import React from 'react';
import {styled} from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useTitleContext} from './titleContext';
import {toolbarHeight, didablePermanent, drawerWidth} from '../../styles/muiTheme';

export {didablePermanent, drawerWidth};

export const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })
(({ theme, open }) => ({
  flexGrow: 1,
  //padding: theme.spacing(didablePermanent ? 1 : 2),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: didablePermanent ? 0 : `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  ...(didablePermanent && {width: '100%'}),
}));

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const AppBar = ({menu_open, handleDrawerOpen, sxColor}) => {
  const {appTitle} = useTitleContext();
  return <StyledAppBar position="fixed" open={menu_open} sx={sxColor}>
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{mr: 2, ...(menu_open && {display: 'none'})}}
      >
        <MenuIcon/>
      </IconButton>
      {appTitle}
    </Toolbar>
  </StyledAppBar>;
};

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingRight: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export const Space = styled('div')(({ theme }) => ({
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const Root = styled('div')(() => ({display: 'flex'}));

export const Content = styled('div')(({ theme }) => ({
  height: `calc(100vh - ${toolbarHeight + 1}px)`,
  width: 'calc(100% - 1px)',
  overflow: 'hidden',
  //--blockSize: '100%',
  //boxSizing: 'content-box',
  display: 'flex',
  flexDirection: 'column',
}));
