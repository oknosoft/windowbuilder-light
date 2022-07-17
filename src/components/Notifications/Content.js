
import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Select from '@material-ui/core/Select';
import NotiList from './NotiList';
import withStyles from 'metadata-react/Header/toolbar';

import classnames from 'classnames';

function NotiContent({classes, filter, filterChange, mark_viewed, clear_log, rows}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRequestClose = () => {
    setAnchorEl(null);
  };

  return <>
    <Toolbar disableGutters className={classes.toolbar}>

      {/* вариант фильтрации */}
      <Select
        className={classes.select}
        value={filter}
        onChange={filterChange}
        multiple
      >
        <MenuItem value="any" className={classnames({[classes.bold]: filter.includes('any')})}>Все</MenuItem>
        <MenuItem value="builder" className={classnames({[classes.bold]: filter.includes('builder')})}>Построитель</MenuItem>
        <MenuItem value="new" className={classnames({[classes.bold]: filter.includes('new')})}>Новые</MenuItem>
        <MenuItem value="error" className={classnames({[classes.bold]: filter.includes('error')})}>Ошибка</MenuItem>
        <MenuItem value="alert" className={classnames({[classes.bold]: filter.includes('alert')})}>Замечание</MenuItem>
        <MenuItem value="note" className={classnames({[classes.bold]: filter.includes('note')})}>Инфо</MenuItem>
      </Select>

      <Typography variant="h6" color="inherit" className={classes.flex}>&nbsp;</Typography>

      {/* меню дополнительных действий */}
      <IconButton onClick={handleMenu} title="Дополнительно"><MoreVertIcon/></IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleRequestClose}
      >
        <MenuItem onClick={mark_viewed}>Считать все прочитанными</MenuItem>
        <MenuItem onClick={clear_log}>Удалить все</MenuItem>
      </Menu>

    </Toolbar>
    <NotiList rows={rows}/>
  </>;

}

export default withStyles(NotiContent);
