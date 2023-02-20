/**
 * Невизуальный компонент, инициализирует метадату
 * и транслирует события адаптера в props потомков
 *
 * Created by Evgeniy Malyarov on 14.02.2021.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {ThemeProvider} from '@mui/material';  // провайдер тема material=ui

import Loading from './Loading';
import {actions, init_state} from './actions';  // события метадаты
import theme from '../../styles/muiTheme';      // тема material=ui

class Metadata extends React.Component {

  constructor() {
    super();
    this.state = init_state;
  }

  handleIfaceState = ({component = '', name, value}) => {
    if(!component) {
      this.setState({[name]: value});
    }
  };

  componentDidMount() {
    // инициализируем MetaEngine
    actions(this);
  }


  render() {
    const {props: {App, initialText}, state, handleIfaceState} = this;
    const {...othes} = state;

    Object.assign(othes, {
      handleIfaceState,
      handlers: {handleIfaceState}
    });

    let show_dumb = !othes.meta_loaded || !othes.common_loaded || !othes.complete_loaded;
    if(show_dumb && othes.common_loaded) {
      show_dumb = false;
    }

    return <ThemeProvider theme={theme}>
      {show_dumb ? <Loading {...othes} html={initialText} /> : <App {...othes}/>}
    </ThemeProvider>;
  }

  getChildContext() {
    const {handleIfaceState} = this;
    return {
      components: {},
      handleIfaceState,
    };
  }
}

Metadata.childContextTypes = {
  components: PropTypes.object,
  handleIfaceState: PropTypes.func,
};

Metadata.propTypes = {
  App: PropTypes.elementType.isRequired,
};

export default Metadata;
