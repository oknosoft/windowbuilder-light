import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router';

import NeedAuth from './NeedAuth'; // страница "необходима авторизация"
import WindowSizer from 'metadata-react/WindowSize';// конструкторы для контекста
import NotFound from '../Markdown/NotFound';

/* eslint-disable-next-line */
import {path, prm} from './menu_items';             // метод для вычисления base path
import {lazy} from './lazy';


class DataRoute extends React.Component {

  render() {
    const {match, handlers, windowHeight, windowWidth, title, disablePermanent, couch_direct, offline, user} = this.props;
    const {area, name} = match.params;
    let _mgr = global.$p && $p[area][name];

    if(!_mgr) {
      return <NotFound/>;
    }

    // если нет текущего пользователя, считаем, что нет прав на просмотр
    if(!user.logged_in || !$p.current_user) {
      return (
        <NeedAuth
          handleNavigate={handlers.handleNavigate}
          handleIfaceState={handlers.handleIfaceState}
          offline={couch_direct && offline}
        />
      );
    }

    const _acl = $p.current_user.get_acl(_mgr.class_name);

    const dx = (windowWidth > 1280 && !disablePermanent) ? 280 : 0;

    const sizes = {
      height: windowHeight > 480 ? windowHeight - 52 : 428,
      width: windowWidth > 800 ? windowWidth - (windowHeight < 480 ? 20 : dx) : 800,
      windowHeight,
      windowWidth,
    };

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
      return <Component _mgr={_mgr} _acl={_acl} match={match} {...sizes} />;
    }

    return <Switch>
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




