
import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

// метод инициализации хранилища состояния приложения
import {history, store, ifaceActions} from './redux';

// заставка "загрузка занных"
import DumbScreen from './components/DumbScreen';

// корневыой контейнер приложения, тема и метод для вычисления need_meta, need_user для location.pathname
import AppView, {muiTheme, item_props} from './components/App';

// типовой RootView, в котором подключается Router и основной макет приложения
import RootView from 'metadata-react/App/RootView';

// sw для оффлайна и прочих дел
import * as serviceWorker from './serviceWorker';

class RootProvider extends React.Component {

  componentDidMount() {
    // font-awesome, roboto и стили metadata подгрузим асинхронно
    import('metadata-react/styles/roboto/font.css');
    import('font-awesome/css/font-awesome.min.css');
    import('./styles/global.css');
    import('./styles/windowbuilder.css');

    // скрипт инициализации структуры метаданных и модификаторы
    import('./metadata')
      .then((module) => module.init(store));
  }

  getChildContext() {
    return {store};
  }

  render() {
    return <Provider store={store}>
      <RootView
        history={history}
        item_props={item_props}
        theme={muiTheme}
        AppView={AppView}
        DumbScreen={DumbScreen}
      />
    </Provider>;
  }
}

RootProvider.childContextTypes = {
  store: PropTypes.object,
};

render(<RootProvider/>, document.getElementById('root'));

serviceWorker.register({
  onUpdate() {
    //$p && $p.record_log('Доступен новый контент, обновите страницу');
    store.dispatch(ifaceActions.IFACE_STATE({
      component: '',
      name: 'snack',
      value: {open: true, reset: true, message: 'Доступна новая версия программы, обновите страницу'},
    }));
  },
  scope: '/',
});
