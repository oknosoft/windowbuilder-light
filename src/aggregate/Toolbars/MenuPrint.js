import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import PrintIcon from '@mui/icons-material/Print';
import ChevronLeft from '@mui/icons-material/ChevronLeft';

function handlePrint(model, {obj, allowModified}) {
  if(!allowModified && !model._data?._formula?.allowModified && (obj._modified || obj.is_new())) {
    return $p.ui.dialogs.alert({
      title: 'Документ изменён',
      text: 'Перед печатью, запишите документ',
    });
  }
  if(model.jsx && 0) {
    obj._manager.print(obj, model);
  }
  else {
    model.execute(obj);
  }
}

class SubMenu extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {anchorEl: props.anchorEl || null};
    this.handleClose = props.handleClose || (() => this.setState({ anchorEl: null }));
    this.handleOpen = (event) => this.setState({anchorEl: event.currentTarget});
    this.handlePrint = (v) => {
      this.handleClose();
      const {props} = this;
      props.handlePrint ? props.handlePrint(v, props) : handlePrint(v, props);
    };
  }

  render() {
    const {props: {items, Icon, text, prefix, variant}, handlePrint, state: {anchorEl}} = this;

    return [
      variant === 'button' ?
        <IconButton key="btn_open" onClick={this.handleOpen}><Icon/></IconButton>
        :
        <MenuItem key={`${prefix}_open`} onClick={this.handleOpen}>
          {Icon && <ListItemIcon><Icon/></ListItemIcon>}
          {text}
        </MenuItem>,
      <Menu key={`${prefix}_menu`}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={this.handleClose}>
        {anchorEl && items.map((v) => <MenuItem key={v.ref} onClick={() => handlePrint(v)}>{v.name}</MenuItem>)}
      </Menu>
    ];
  }
}

class MenuPrint extends SubMenu {

  constructor(props, context) {
    super(props, context);
    this.state.plates = [];
  }

  componentDidMount() {
    const mgr = this.props.mgr || this.props.scheme?.child_meta()?.mgr || this.props.obj?._manager;
    mgr && mgr.printing_plates()
      .then((plates) => {
        const groups = new Map();
        for(const key in plates) {
          const plate = plates[key];
          const group = plate.name.includes('/') ? plate.name.substring(0, plate.name.indexOf('/')).trim() : 'Общее';
          if(!groups.get(group)) {
            groups.set(group, []);
          }
          groups.get(group).push(plate);
        }
        plates = [];
        groups.forEach((value, name) => plates.push({name, value}));
        this.setState({plates});
      });
  }

  render() {
    const {props: {variant, ...other}, state: {anchorEl, plates}} = this;

    if(plates.length === 1) {
      return <SubMenu
        items={plates[0].value}
        Icon={PrintIcon}
        text="Печать"
        prefix="root"
        variant={variant}
        {...other}
      />;
    }

    let button;
    if(variant === 'button') {
      button = <IconButton key="btn_open" onClick={this.handleOpen}><PrintIcon/></IconButton>;
    }
    else if(variant === 'hidden') {
      button = null;
    }
    else {
      button = <MenuItem key="prn_open" onClick={this.handleOpen}><ListItemIcon><PrintIcon/></ListItemIcon>Печать</MenuItem>;
    }
    return [
      button,

      <Menu key="prn_menu"
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={this.handleClose}>
        {anchorEl && plates.map((plate, index) => <SubMenu
          key={`prn_${index}`}
          items={plate.value}
          Icon={ChevronLeft}
          text={plate.name}
          prefix={`prn_${index}`}
          {...other}
        />)}
      </Menu>
    ];
  }
}

MenuPrint.propTypes = {
  mgr: PropTypes.object,          // менеджер данных
  obj: PropTypes.object,          // объект данных
  scheme: PropTypes.object,       // значение настроек компоновки
  handlePrint: PropTypes.func,    // обработчик открытия диалога печати
  variant: PropTypes.string,      // использовать IconButton вместо MenuItem
  allowModified: PropTypes.bool,  // использовать IconButton вместо MenuItem
};

export default MenuPrint;
