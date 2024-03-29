import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import DialogActions from '@material-ui/core/DialogActions';

import Confirm from 'metadata-react/App/Confirm';
import withStyles from 'metadata-react/styles/paper600';

class Settings extends React.Component {

  constructor(props) {
    super(props);
    let {zone, couch_path, couch_direct} = props;
    const {wsql, cat, current_user, pricing} = $p;

    let hide_price;
    if(wsql.get_user_param('hide_price_dealer')) {
      hide_price = 'dealer';
    }
    else if(wsql.get_user_param('hide_price_manufacturer')) {
      hide_price = 'manufacturer';
    }
    else {
      hide_price = 'none';
    }

    let surcharge_internal = wsql.get_user_param('surcharge_internal', 'number');
    let discount_percent_internal = wsql.get_user_param('discount_percent_internal', 'number');
    let surcharge_disabled = false;

    if(current_user && current_user.partners_uids.length) {

      // если заданы параметры для текущего пользователя - используем их
      if(!surcharge_internal) {

        let partner = cat.partners.get(current_user.partners_uids[0]);
        let prm = {
          calc_order_row: {
            nom: cat.nom.get(),
            characteristic: {params: {find_rows: () => null}},
            _owner: {_owner: {partner: partner}}
          }
        };

        pricing.price_type(prm);

        wsql.set_user_param('surcharge_internal', surcharge_internal = prm.price_type.extra_charge_external);
        wsql.set_user_param('discount_percent_internal', discount_percent_internal = prm.price_type.discount_external);
      }
    }
    else {
      surcharge_disabled = true;
    }

    this.state = {
      zone, couch_path, couch_direct, hide_price,
      confirm_reset: false, surcharge_internal, discount_percent_internal, surcharge_disabled
    };
  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
  }

  shouldComponentUpdate({handleIfaceState, title}) {
    const ltitle = 'Настройки';
    if(title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    return true;
  }

  handleSetPrm = () => {
    const {hide_price, ...state} = this.state;
    if(hide_price == 'dealer') {
      state.hide_price_dealer = true;
      state.hide_price_manufacturer = '';
    }
    else if(hide_price == 'manufacturer') {
      state.hide_price_dealer = '';
      state.hide_price_manufacturer = true;
    }
    else {
      state.hide_price_dealer = '';
      state.hide_price_manufacturer = '';
    }
    this.props.handleSetPrm(state);

    this.props.handleIfaceState({component: '', name: 'snack',
      value: {open: true, reset: true, message: 'Требуется перезагрузить страницу после изменения параматров'}});
  };

  handleHidePriceChange = (event, value) => {
    this.setState({hide_price: value});
  };


  openConfirm = () => this.setState({confirm_reset: true});

  closeConfirm = () => this.setState({confirm_reset: false});

  resetData = () => {
    this.closeConfirm();
    $p.eve && ($p.eve.redirect = true);
    $p.adapters.pouch.reset_local_data();
  };

  valueToState(name) {
    return ({target}) => {
      const value = ['discount_percent_internal', 'surcharge_internal'].indexOf(name) != -1 ? (parseFloat(target.value) || 0) : target.value;
      this.setState({[name]: value});
    };
  }

  render() {
    const {classes} = this.props;
    const {
      zone, couch_path, couch_direct, confirm_reset, hide_price,
      surcharge_internal, discount_percent_internal, surcharge_disabled
    } = this.state;

    return (
      <div className={classes.root}>

        <Typography variant="subtitle2" style={{paddingTop: 16}}>Подключение к базе данных</Typography>

        <TextField
          fullWidth
          margin="dense"
          label="Адрес CouchDB"
          InputProps={{placeholder: 'couch_path'}}
          helperText="Абсолютный либо относительный путь CouchDB"
          onChange={this.valueToState('couch_path')}
          value={couch_path}/>

        <TextField
          fullWidth
          margin="dense"
          label="Область данных"
          InputProps={{placeholder: 'zone'}}
          helperText="Значение разделителя данных"
          onChange={this.valueToState('zone')}
          value={zone}/>

        <FormGroup>
          <FormControl>
            <FormControlLabel
              control={<Switch
                onChange={(event, checked) => this.setState({couch_direct: checked})}
                checked={Boolean(couch_direct)}/>}
              label={couch_direct ? "Прямое подключение к серверу" : "Работа через IDB браузера" }
            />
            <FormHelperText style={{marginTop: -4}}>{couch_direct ? "Оффлайн не используется" : "Автономный режим при недоступности сервера"}</FormHelperText>
          </FormControl>

        </FormGroup>

        <Typography variant="subtitle2" style={{paddingTop: 16}}>Колонки цен</Typography>
        <Typography>Настройка видимости колонок в документе &quot;Расчет&quot; и графическом построителе</Typography>
        <RadioGroup
          className={classes.group}
          value={hide_price}
          onChange={this.handleHidePriceChange}
        >
          <FormControlLabel value="none" control={<Radio/>} label="Показывать все цены"/>
          <FormControlLabel value="dealer" control={<Radio/>} label="Скрыть цены дилера"/>
          <FormControlLabel value="manufacturer" control={<Radio/>} label="Скрыть цены завода"/>

        </RadioGroup>

        <Typography variant="subtitle2" style={{paddingTop: 16}}>Наценки и скидки</Typography>
        <Typography>Значения наценки и скидки по умолчанию, которые дилер предоставляет своим (конечным) покупателям</Typography>

        <TextField
          fullWidth
          margin="dense"
          label="Наценка дилера, %"
          InputProps={{placeholder: 'surcharge_internal'}}
          helperText="Наценка относительно цены производителя"
          onChange={this.valueToState('surcharge_internal')}
          value={surcharge_internal}
          disabled={surcharge_disabled}
        />

        <TextField
          fullWidth
          margin="dense"
          label="Скидка дилера, %"
          InputProps={{placeholder: 'discount_percent_internal'}}
          helperText="Скидка конечного клиента относительно цены дилера"
          onChange={this.valueToState('discount_percent_internal')}
          value={discount_percent_internal}
          disabled={surcharge_disabled}
        />

        <DialogActions style={{marginBottom: 0, marginRight: 0}}>
          <Button size="small" className={classes.button} onClick={this.handleSetPrm}>Сохранить настройки</Button>
          <Button size="small" className={classes.button} onClick={this.openConfirm}>Сбросить данные</Button>
        </DialogActions>

        <Confirm
          title="Сброс данных"
          text="Уничтожить локальные данные и пересоздать базы в IndexedDB браузера?"
          handleOk={this.resetData}
          handleCancel={this.closeConfirm}
          open={confirm_reset}
        />
      </div>
    );
  }
}

Settings.propTypes = {
  zone: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  couch_path: PropTypes.string,
  title: PropTypes.string,
  couch_direct: PropTypes.bool,
  handleSetPrm: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

export default withStyles(Settings);
