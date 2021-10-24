/**
 * Невизуальный компонент, инициализирует метадату
 * и транслирует события адаптера в props потомков
 *
 * Created by Evgeniy Malyarov on 14.02.2021.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {ThemeProvider} from '@material-ui/styles';  // провайдер тема material=ui
import {createBrowserHistory} from 'history';
import Snack from 'metadata-react/App/Snack';       // сообщения в верхней части страницы (например, обновить после первого запуска)
import Alert from 'metadata-react/App/Alert';       // диалог сообщения пользователю
import Confirm from 'metadata-react/App/Confirm';   // диалог вопросов пользователю (да, нет)
import WindowPortal from 'metadata-react/App/WindowPortal';   // контент в новом окне (например, для печати)
import Loading from '../DumbScreen/Loading';
import {actions, init_state} from './actions';      // события метадаты
import theme from './muiTheme';                     // тема material=ui
import {lazy} from './lazy';                        // конструкторы для контекста

const history = createBrowserHistory();

const handleNavigate = (url) => {
  history.push(url);
};

class Metadata extends React.Component {

  constructor() {
    super();
    this.state = init_state;
  }

  handleIfaceState = ({component = '', name, value}) => {
    if(!component) {
      if(value === 'invert') {
        value = !this.state[name];
      }
      this.setState({[name]: value});
    }
    else {
      if(value === 'invert') {
        const state = this.state[component] || {}
        value = !state[name];
      }
      this.setState({[component]: {[name]: value}});
    }
  };

  handleDialogClose = (name) => {
    this.handleIfaceState({name, value: {open: false}});
  };

  componentDidMount() {
    // инициализируем MetaEngine
    actions(this);
  }


  render() {
    const {props: {App}, state, handleIfaceState, handleDialogClose} = this;
    const {snack, alert, confirm, wnd_portal, ...othes} = state;
    return <ThemeProvider theme={theme}>
      {snack && snack.open && <Snack snack={snack} handleClose={handleDialogClose.bind(this, 'snack')}/>}
      {alert && alert.open && <Alert {...alert} handleOk={handleDialogClose.bind(this, 'alert')}/>}
      {confirm && confirm.open && <Confirm {...confirm}/>}
      {wnd_portal && wnd_portal.open && <WindowPortal {...wnd_portal}/>}
      {othes.meta_loaded && othes.common_loaded && othes.complete_loaded ?
        <App handleIfaceState={handleIfaceState} handleNavigate={handleNavigate} history={history} {...othes}/>
        :
        <Loading {...othes} />
      }
    </ThemeProvider>;
  }

  getChildContext() {
    const {handleIfaceState} = this;
    return {components: lazy, handleNavigate, handleIfaceState};
  }
}

Metadata.childContextTypes = {
  components: PropTypes.object,
  handleIfaceState: PropTypes.func,
  handleNavigate: PropTypes.func,
};

Metadata.propTypes = {
  App: PropTypes.elementType.isRequired,
};

export default Metadata;
