import React from 'react';
import PropTypes from 'prop-types';
import {Router, Switch, Route, Redirect} from 'react-router-dom';

import Header from './Header';  // навигация

import Templates from 'wb-forms/dist/CalcOrder/Templates';  // stepper выбора шаблона изделия

import DataRoute from './DataRoute';                // вложенный маршрутизатор страниц с данными
import MarkdownRoute from '../Markdown';            // вложенный маршрутизатор страниц с Markdown, 404 живёт внутри Route
import Settings from '../Settings';                 // страница настроек приложения
import Builder from '../Builder';                   // графический редактор

import withStyles from './styles';

import items, {item_props, path} from './menu_items'; // массив элементов меню и метод для вычисления need_meta, need_user по location.pathname

// основной layout
class Frame extends React.Component {

  handleDialogClose(name) {
    this.props.handleIfaceState({component: '', name, value: {open: false}});
  }

  handleReset(reset) {
    const {handleNavigate, first_run} = this.props;
    (first_run || reset) ? location.replace(path('')) : handleNavigate(path(''));
  }

  render() {
    /* eslint-disable-next-line */
    const {classes, ...props} = this.props;
    const {history, user, couch_direct, offline, title, idle, handleIfaceState, handleNavigate} = props;
    const iprops = item_props();

    // const auth_props = {
    //   key: 'auth',
    //   handleNavigate,
    //   handleIfaceState,
    //   offline: couch_direct && offline,
    //   user,
    //   title,
    //   idle,
    //   disable: ['google'],
    //   ret_url: path(''),
    // };

    const wraper = (Component, routeProps) => {
      return <Component {...props} {...routeProps}/>;
    };

    return <>
      {iprops.header ? null : <Header items={items} {...props} />}

      <Router history={history}>
        <Switch key="switch">
          <Route exact path={path('')} render={() => <Redirect to={path('doc.calc_order/list')}/>}/>
          <Route path={path('o/')} render={() => <Redirect to={location.pathname.replace('/o/', '/doc.calc_order/')}/>}/>
          <Route path={`${path('builder')}/:ref([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`}
                 render={(props) => wraper(Builder, props)}/>
          <Route path={path('templates')} render={(props) => wraper(Templates, props)}/>
          {/*<Route path={path('login')} render={(props) => <Login {...props} {...auth_props} />}/>*/}
          <Route path={path('settings')} render={(props) => wraper(Settings, props)}/>
          <Route path={`${path('')}:area(doc|cat|ireg|cch|rep).:name`} render={(props) => wraper(DataRoute, props)}/>
          <Route render={(props) => wraper(MarkdownRoute, props)}/>
        </Switch>
      </Router>
    </>;
  }

}

Frame.propTypes = {
  handleIfaceState: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  first_run: PropTypes.bool,
};

export default withStyles(Frame);
