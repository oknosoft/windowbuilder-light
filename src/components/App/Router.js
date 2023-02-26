/**
 * Маршрутизатор верхнего уровня
 * {Главная, Настройки, Авторизация, Формы данных, Статьи}
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {createBrowserRouter} from 'react-router-dom';
import Loading from '../App/Loading';
import RootWithDrawer from './RootWithDrawer';

const Home = React.lazy(() => import('../Home'));
const FrmLogin = React.lazy(() => import('../FrmLogin'));
const Page = React.lazy(() => import('../Pages/Page'));
const Scheduler = React.lazy(() => import('../Scheduler/Stub'));

const Wraper = (Component) => {
  return <React.Suspense fallback={<Loading/>}>
    <Component/>
  </React.Suspense>;
};

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
      {path: "store", element: pageRoute},
      {path: "sales", element: pageRoute},
      {path: "about", element: pageRoute},
      {path: "login", element: loginRoute},
      {path: "profile", element: loginRoute},
      {path: "password-reset", element: loginRoute},
    ],
  },
]);





