import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import {styles} from 'metadata-react/Markdown/MarkdownDocsLight';

const useStyles = makeStyles(styles);

import {path, prm} from '../App/menu'; // метод для вычисления base path

// 404
import NotFound from './NotFound';

// информация о программе
import About from './About';

// Справка
import Help from './Help';
import {lazy} from '../App/lazy';


export default function MarkdownRoute(props) {
  const classes = useStyles();
  const wraper = (Component, rprops) => <Component {...props} {...rprops} classes={classes} />;

  return <Switch>
    <Route path={path("about")} render={(rprops) => wraper(About, rprops)}/>
    <Route path={path("help")} render={(rprops) => wraper(Help, rprops)}/>
    <Route render={(rprops) => wraper(NotFound, rprops)}/>
  </Switch>;
}

MarkdownRoute.propTypes = {
  match: PropTypes.object.isRequired,
};




