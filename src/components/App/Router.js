/**
 * Маршрутизатор верхнего уровня
 * {Главная, Настройки, Авторизация, Формы данных, Статьи}
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import RootWithDrawer from './RootWithDrawer';

import Home from '../Home';
import About from '../Pages/About';
import Page from '../Pages/Page';
import FrmLogin from '../FrmLogin';

const DataRoute = (props) => {
  return 'DataRoute';
};



const loginRoute = <FrmLogin />;

export const router = createBrowserRouter([
  {
    element: <RootWithDrawer />,
    errorElement: <RootWithDrawer />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: ":area.:name",
        element: <DataRoute />,
      },
      {
        path: "partners",
        element: <Page />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "login",
        element: loginRoute,
      },
      {
        path: "profile",
        element: loginRoute,
      },
      {
        path: "password-reset",
        element: loginRoute,
      },
    ],
  },
]);





