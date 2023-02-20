/**
 * Маршрутизатор верхнего уровня
 * {Главная, Настройки, Авторизация, Формы данных, Статьи}
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Route, Routes} from 'react-router-dom';

import Home from '../Home';

const DataRoute = (props) => {
  return 'DataRoute';
};
const FrmLogin = () => 'FrmLogin';

function AppRouter(props) {
  // const {match, handlers, offline, user} = this.props;
  // const {area, name} = match.params;

  const dataRoute = <DataRoute {...props}/>;
  const loginRoute = <FrmLogin {...props}/>;

  return <Routes>
    <Route path="/" element={<Home {...props}/>}/>
    <Route path=":area.:name" element={dataRoute}/>
    <Route path="login" element={loginRoute}/>
    <Route path="profile" element={loginRoute}/>
    <Route path="password-reset" element={loginRoute}/>
  </Routes>;
}

AppRouter.propTypes = {
  handlers: PropTypes.object.isRequired,
};

export default AppRouter;




