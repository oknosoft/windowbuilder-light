import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import IconHome from '@mui/icons-material/Home';

import {drawerWidth, didablePermanent, DrawerHeader} from './styled';
import menuItems from '../App/menu';

const DrawerLeft = ({menu_open, sxColor, navigate, handleDrawerClose}) => (<Drawer
  sx={{
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
    },
  }}
  variant={didablePermanent ? 'temporary' : 'persistent'}
  anchor="left"
  open={menu_open}
>
  <DrawerHeader sx={{...sxColor, boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 7%)'}}>
    <ListItem sx={{flex: 1}} disablePadding onClick={() => navigate('/')}>
      <ListItemButton>
        <ListItemIcon>
          <IconHome />
        </ListItemIcon>
        <ListItemText primary="Главная" />
      </ListItemButton>
    </ListItem>
    <IconButton onClick={handleDrawerClose}>
      <ChevronLeftIcon />
    </IconButton>
  </DrawerHeader>
  <Divider />
  <List>
    {menuItems.map(({text, icon, navigate, divider}, index) => {
      return divider ?
        <Divider key={`divider-${index}`} /> :
        <ListItem key={`menu-${index}`} disablePadding>
          <ListItemButton>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>;
    })}
  </List>
</Drawer>);

export default DrawerLeft;
