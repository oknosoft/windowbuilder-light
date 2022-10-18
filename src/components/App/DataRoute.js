import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router';

import NeedAuth from './NeedAuth'; // страница "необходима авторизация"
import WindowSizer from 'metadata-react/WindowSize';// конструкторы для контекста
import FrmLogin from 'metadata-react/FrmLogin/Proxy/FrmLogin';
import NotFound from '../Markdown/NotFound';

/* eslint-disable-next-line */
import {path, prm} from './menu';             // метод для вычисления base path
import {lazy} from './lazy';


class DataRoute extends React.Component {

  render() {
    const {match, handlers, windowHeight, windowWidth, title, disablePermanent, couch_direct, offline, idle,
      user, iprops, complete_loaded} = this.props;
    const {area, name} = match.params;
    let _mgr = area && name && $p[area][name];

    if(!_mgr && !match.path.includes('login')) {
      return <NotFound/>;
    }

    const {current_user} = $p;
    let need_auth = iprops.need_user && ((!user.try_log_in && !user.logged_in) || (couch_direct && offline));
    if(need_auth && !couch_direct && complete_loaded) {
      if(current_user && current_user.name == user.name) {
        need_auth = false;
      }
    }

    const auth_props = {
      offline: couch_direct && offline,
      user,
      title,
      idle,
      pfilter(key) {
        return key === 'couchdb';
      },
      _obj: current_user,
    };

    // если нет текущего пользователя, считаем, что нет прав на просмотр
    if(match.path.includes('login')) {
      return (
        // <NeedAuth
        //         handleNavigate={handlers.handleNavigate}
        //         handleIfaceState={handlers.handleIfaceState}
        //         offline={couch_direct && offline}
        //         ComponentLogin={FrmLogin}
        //         {...auth_props}
        //       />

        <FrmLogin
          handleNavigate={handlers.handleNavigate}
          handleIfaceState={handlers.handleIfaceState}
          offline={couch_direct && offline}
          {...auth_props}
        />
      );
    }


    const sizes = {
      height: windowHeight > 480 ? windowHeight - 52 : 428,
      width: windowWidth > 800 ? windowWidth : 800,
      windowHeight,
      windowWidth,
    };

    const _acl = current_user ? current_user.get_acl(_mgr.class_name) : 'r';

    const wraper = (Component, props, type) => {

      // уточняем _mgr для MultiManagers
      if(type === 'obj' && _mgr._indexer) {
        const aprm = prm();
        if(aprm.area && _mgr.cachable !== aprm.area){
          _mgr._indexer._mgrs.some((mgr) => {
            if(mgr.cachable === aprm.area){
              return _mgr = mgr;
            }
          });
        }
      }

      if(type === 'obj' && _mgr.FrmObj) {
        Component = _mgr.FrmObj;
      }
      else if(type === 'list' && _mgr.FrmList) {
        Component = _mgr.FrmList;
      }
      return <Component _mgr={_mgr} _acl={_acl} handlers={handlers} title={title} {...props} {...handlers} {...sizes} />;
    };

    if(area === 'rep') {
      const Component = _mgr.FrmObj || lazy.FrmReport;
      return <Component _mgr={_mgr} _acl={_acl} match={match} title={title} {...handlers} {...sizes} />;
    }

    return <Switch>
      <Route path={`${match.url}/list`} render={(props) => wraper(lazy.DataList, props, 'list')}/>
      <Route path={`${match.url}/:ref([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`} render={(props) => wraper(lazy.DataObj, props, 'obj')}/>
      <Route path={`${match.url}/list`} render={(props) => wraper(lazy.DataList, props, 'list')}/>
      <Route path={`${match.url}/:num([A-Z0-9]{6})`} render={(props) => wraper(lazy.DataObj, props, 'obj')}/>
      <Route component={NotFound}/>
    </Switch>;
  }

}

DataRoute.propTypes = {
  match: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  windowHeight: PropTypes.number.isRequired,
  windowWidth: PropTypes.number.isRequired,
  disablePermanent: PropTypes.bool,
  couch_direct: PropTypes.bool,
  offline: PropTypes.bool,
  user: PropTypes.object,
  title: PropTypes.string,
};

export default WindowSizer(DataRoute);




