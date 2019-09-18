import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router';

import {path} from '../App/menu_items'; // метод для вычисления base path

// 404
import NotFound from './NotFound';

// информация о программе
import About from './About';

// Справка
import Help from './Help';


export default function MarkdownRoute() {
  return <Switch>
    <Route path={path("about")} component={About}/>
    <Route path={path("help")} component={Help}/>
    <Route component={NotFound}/>
  </Switch>;
}

MarkdownRoute.propTypes = {
  match: PropTypes.object.isRequired,
};




