import React from 'react';
import {useNavigate} from 'react-router';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import FactoryIcon from '@mui/icons-material/Factory';
import CachedIcon from '@mui/icons-material/Cached';
import PostBtn from '../../aggregate/FrmObj/PostBtn';

export default function TaskPostBtn({obj, changeTask}) {
  const navigate = useNavigate();

  const [menuItems, onProcessed] = React.useMemo(() => {
    const toTask = () => navigate(`/doc/work_centers_task/${obj?.ref}?return=/rmd&modified=false`);
    const queryChangeTask = () => navigate(`/doc/work_centers_task?return=/rmd&select=true`);
    return [<>
      <MenuItem onClick={toTask}>
        <ListItemIcon><FactoryIcon /></ListItemIcon>
        <ListItemText>Перейти в задание</ListItemText>
      </MenuItem>
      <MenuItem onClick={queryChangeTask} >
        <ListItemIcon><CachedIcon /></ListItemIcon>
        <ListItemText>Сменить задание</ListItemText>
      </MenuItem>
    </>, () => changeTask(obj)];
  }, [obj]);


  return <PostBtn obj={obj} menuItems={menuItems} onProcessed={onProcessed} hideDelete />;
}
