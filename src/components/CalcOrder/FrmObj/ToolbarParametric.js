import React from "react";
import Toolbar from '@material-ui/core/Toolbar';
import {withStyles, TabularSectionToolbar} from 'metadata-react/TabularSection/TabularSectionToolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Filter1 from '@material-ui/icons/Filter1';
import Filter9Plus from '@material-ui/icons/Filter9Plus';
import HttpIcon from '@material-ui/icons/Http';
import RemoveIcon from '@material-ui/icons/DeleteOutline';
import RemoveAllIcon from '@material-ui/icons/DeleteSweep';
import CopyIcon from '@material-ui/icons/FileCopy';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileDownloadIcon from '@material-ui/icons/ArrowDropDownCircle';
import IconSettings from '@material-ui/icons/Settings';
import IconSettingsCancel from '@material-ui/icons/HighlightOff';
import IconSettingsDone from '@material-ui/icons/Done';

class ToolbarParametric extends TabularSectionToolbar {

  render() {
    const {props, state} = this;
    const {classes, btns, width, settings_open, menu_items} = props;

    return (
      <Toolbar disableGutters className={classes.toolbar} style={{width: width || '100%'}}>
        {[
          <IconButton key="btn_standart" title="Стандартные параметры" onClick={btns.setStandart}><Filter1 /></IconButton>,
          <IconButton key="btn_extend" title="Расширенные параметры" onClick={btns.setExtend}><Filter9Plus /></IconButton>,
          <IconButton key="btn_http" title="Параметры из сервиса внешнего поставщика" onClick={btns.setHttp}><HttpIcon /></IconButton>,
          <IconButton key="btn_del" title="Удалить строку" onClick={props.handleRemove}><RemoveIcon /></IconButton>,
          <IconButton key="btn_clear" title="Удалить все строки" onClick={props.handleClear}><RemoveAllIcon /></IconButton>,

          <Typography key="space" variant="h6" color="inherit" className={classes.flex}> </Typography>,

          !settings_open && <IconButton key="more" onClick={this.handleMenuOpen} title="Дополнительно">
            <MoreVertIcon/>
          </IconButton>,

          !settings_open && <Menu key="menu" anchorEl={state.anchorEl} open={state.menuOpen} onClose={this.handleMenuClose}>
            <MenuItem onClick={this.handleExportCSV}><CopyIcon/> &nbsp;Копировать CSV</MenuItem>
            <MenuItem onClick={this.handleExportJSON}><CloudDownloadIcon/> &nbsp;Копировать JSON</MenuItem>
            <MenuItem onClick={this.handleExportXLS}><FileDownloadIcon/> &nbsp;Экспорт в XLS</MenuItem>
            {
              // дополнительные пункты меню
              menu_items
            }
            <MenuItem onClick={() => {
              this.handleMenuClose();
              props.handleSettingsOpen();
            }}><IconSettings/> &nbsp;Настройка списка</MenuItem>

          </Menu>,

          settings_open && <IconButton key="ss4" title="Применить настройки" onClick={props.handleSettingsClose}><IconSettingsDone/></IconButton>,
          settings_open && <IconButton key="ss5" title="Скрыть настройки" onClick={props.handleSettingsClose}><IconSettingsCancel/></IconButton>

        ]}
      </Toolbar>
    );
  }
}

export default withStyles(ToolbarParametric);
