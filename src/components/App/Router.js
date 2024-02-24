/**
 * Маршрутизатор верхнего уровня
 * {Главная, Настройки, Авторизация, Формы данных, Статьи}
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {createBrowserRouter} from 'react-router-dom';
import {Wraper} from './Wraper';
import RootWithDrawer from './RootWithDrawer';

const Home = React.lazy(() => import('../Home'));
const FrmLogin = React.lazy(() => import('../FrmLogin'));
const Page = React.lazy(() => import('../Pages/Page'));
const Help = React.lazy(() => import('../Pages/Help'));
const Scheduler = React.lazy(() => import('../Scheduler/Stub'));
const RMD = React.lazy(() => import('../RMD'));
const DataRoute = React.lazy(() => import('../../metadata/Router'));

const loginRoute = Wraper(FrmLogin);
const pageRoute = Wraper(Page);

export const router = createBrowserRouter([
  {
    element: <RootWithDrawer />,
    errorElement: <RootWithDrawer />,
    children: [
      {path: "/", element: Wraper(Home)},
      {path: "partners", element: pageRoute},
      {path: "production", element: pageRoute},
      {path: "scheduler", element: Wraper(Scheduler)},
      {path: "rmd", element: Wraper(RMD)},
      {path: "store", element: pageRoute},
      {path: "sales", element: pageRoute},
      {path: "about", element: pageRoute},
      {path: "help/*", element: Wraper(Help)},
      {path: "login", element: loginRoute},
      {path: "profile", element: loginRoute},
      {path: "password-reset", element: loginRoute},
      {path: "*", element: Wraper(DataRoute)},
    ],
  },
]);





