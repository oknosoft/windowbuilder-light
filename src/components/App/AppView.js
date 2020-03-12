import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Route, Redirect} from 'react-router';
import Snack from 'metadata-react/App/Snack';       // сообщения в верхней части страницы (например, обновить после первого запуска)
import Alert from 'metadata-react/App/Alert';       // диалог сообщения пользователю
import Confirm from 'metadata-react/App/Confirm';   // диалог вопросов пользователю (да, нет)
import WindowPortal from 'metadata-react/App/WindowPortal';   // контент в новом окне (например, для печати)
import Login, {FrmLogin} from 'metadata-react/FrmLogin/Proxy';  // логин и свойства подключения
import NeedAuth from 'metadata-react/App/NeedAuth'; // страница "необходима авторизация"
import Header from 'metadata-react/Header';         // навигация
import {compose} from 'redux';
import {withNavigateAndMeta} from 'metadata-redux';
import withWindowSize from 'metadata-react/WindowSize';

import DumbScreen from '../DumbScreen';             // заставка "загрузка занных"
import DataRoute from './DataRoute';                // вложенный маршрутизатор страниц с данными
import MarkdownRoute from '../Markdown';            // вложенный маршрутизатор страниц с Markdown, 404 живёт внутри Route
import Settings from '../Settings';                 // страница настроек приложения
import Builder from '../Builder';                   // графический редактор
import Templates from '../Templates';               // stepper выбора шаблона изделия
import {lazy} from './lazy';                        // конструкторы для контекста

import withStyles from './styles';


import items, {item_props, path} from './menu_items'; // массив элементов меню и метод для вычисления need_meta, need_user по location.pathname

// основной layout
class AppView extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handleAlertClose = this.handleDialogClose.bind(this, 'alert');
    const iprops = item_props();
    this.state = {
      need_meta: !!iprops.need_meta,
      need_user: !!iprops.need_user,
      mobileOpen: false,
    };
  }

  shouldComponentUpdate(props, {need_user, need_meta}) {
    const iprops = item_props();
    let res = true;

    if(need_user != !!iprops.need_user) {
      this.setState({need_user: !!iprops.need_user});
      res = false;
    }

    if(need_meta != !!iprops.need_meta) {
      this.setState({need_meta: !!iprops.need_meta});
      res = false;
    }

    return res;
  }

  handleDialogClose(name) {
    this.props.handleIfaceState({component: '', name, value: {open: false}});
  }

  handleReset(reset) {
    const {handleNavigate, first_run} = this.props;
    (first_run || reset) ? location.replace(path('')) : handleNavigate(path(''));
  }

  handleDrawerToggle = () => {
    const {state} = this;
    this.setState({mobileOpen: !state.mobileOpen});
  };

  handleDrawerClose = () => {
    this.setState({mobileOpen: false});
  };

  render() {
    /* eslint-disable-next-line */
    const {classes, ...props} = this.props;
    const {snack, alert, confirm, wnd_portal, meta_loaded, doc_ram_loaded, page, user, couch_direct, offline, title, idle} = props;
    const iprops = item_props();


    let need_auth = meta_loaded && iprops.need_user && ((!user.try_log_in && !user.logged_in) || (couch_direct && offline));
    if(need_auth && !couch_direct && props.complete_loaded) {
      const {current_user} = $p;
      if(current_user && current_user.name == user.name) {
        need_auth = false;
      }
    }

    const auth_props = {
      key: 'auth',
      handleNavigate: props.handleNavigate,
      handleIfaceState: props.handleIfaceState,
      offline: couch_direct && offline,
      user,
      title,
      idle,
      disable: ['google'],
      ret_url: path(''),
    };

    const wraper = (Component, routeProps) => {
      return <Component {...props} {...routeProps}/>;
    };

    return [

      <Header key="header" items={items} {...props} />,

      // основной layout
      // основной контент или заставка загрузки или приглашение к авторизации
      need_auth || idle ?
        (
          <NeedAuth {...auth_props} ComponentLogin={FrmLogin}/>
        )
        :
        (
          (((iprops.need_meta && !meta_loaded) || (iprops.need_user && !props.complete_loaded))) ?
            <DumbScreen
              key="dumb"
              title={doc_ram_loaded ? 'Подготовка данных в памяти...' : 'Загрузка справочников...'}
              page={page && page.docs_written < page.total_rows ? page : {text: `${(page && page.synonym) || 'Почти готово'}...`}}
            />
            :
            <Switch key="switch">
              <Route exact path={path('')} render={() => <Redirect to={path('doc.calc_order/list')}/>}/>
              <Route path={path('o/')} render={() => <Redirect to={location.pathname.replace('/o/', '/doc.calc_order/')}/>}/>
              <Route path={`${path('builder')}/:ref([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`}
                     render={(props) => wraper(Builder, props)}/>
              <Route path={path('templates')} render={(props) => wraper(Templates, props)}/>
              <Route path={path('login')} render={(props) => <Login {...props} {...auth_props} />}/>
              <Route path={path('settings')} render={(props) => wraper(Settings, props)}/>
              <Route path={`${path('')}:area(doc|cat|ireg|cch|rep).:name`} render={(props) => wraper(DataRoute, props)}/>
              <Route render={(props) => wraper(MarkdownRoute, props)}/>
            </Switch>
        ),

      // всплывающтй snackbar оповещений пользователя
      ((snack && snack.open) || (props.first_run && doc_ram_loaded)) &&
      <Snack
        key="snack"
        snack={snack}
        handleClose={snack && snack.open && !snack.reset ? this.handleDialogClose.bind(this, 'snack') : () => this.handleReset(snack && snack.reset)}
      />,

      // диалог сообщений пользователю
      alert && alert.open &&
      <Alert key="alert" {...alert} handleOk={this.handleAlertClose}/>,

      // диалог вопросов пользователю (да, нет)
      confirm && confirm.open && <Confirm key="confirm" {...confirm}/>,

      wnd_portal && wnd_portal.open && <WindowPortal key="wnd_portal" {...wnd_portal}/>,
    ];
  }

  getChildContext() {
    return {components: lazy};
  }
}

AppView.propTypes = {
  handleNavigate: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  first_run: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  snack: PropTypes.object,
  alert: PropTypes.object,
  confirm: PropTypes.object,
};

AppView.childContextTypes = {
  components: PropTypes.object,
};

export default compose(withStyles, withWindowSize, withNavigateAndMeta)(AppView);
