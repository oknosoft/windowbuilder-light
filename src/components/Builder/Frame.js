/**
 * Каркас графического редактора
 * builder/4b1af400-d12a-11e9-a38f-c343d95aab02
 *
 * @module Frame
 *
 * Created by Evgeniy Malyarov on 26.09.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import {Prompt} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import {path} from '../App/menu_items';
import Wrapper from '../App/Wrapper';
import Builder from './Builder';
import Toolbar from './Toolbar';
import Controls from './Controls';

const styles = ({spacing, typography}) => ({
  content: {
    padding: spacing(),
  },
  canvas: {
    marginLeft: spacing() / 2,
    marginTop: spacing() / 2,
  },
  title: {
    flexGrow: 1,
  },
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
  padding: {
    paddingLeft: spacing(),
    paddingRight: spacing(),
  },
  extendedIcon: {
    marginRight: spacing(),
  },
});

const ltitle = 'Редактор';

class Frame extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const {props} = this;
    props.handleIfaceState({
      component: '',
      name: 'title',
      value: ltitle,
    });
    if(this.editor) {
      this.editor.project.load(props.match.params.ref)
        .then(() => {
          props.handleIfaceState({
            component: '',
            name: 'title',
            value: this.editor.project.ox.name,
          });
        });
    }

  }

  /**
   * проверка, можно ли покидать страницу
   * @return {String|Boolean}
   */
  prompt = () => {
    if(!this.editor || !this.editor.project) {
      return true;
    }
    const {ox} = this.editor.project;
    return ox && ox._modified ? `Изделие ${ox.prod_name(true)} изменено.\n\nЗакрыть без сохранения?` : true;
  }

  render() {
    const {editor, props: {title, classes, handleIfaceState, handleNavigate, windowHeight, windowWidth, iface_kind}} = this;
    let height = (windowWidth > 720 ? windowHeight - 48 - 8 : windowWidth) - (iface_kind !== 'quick' ? 50 : 0);
    return <Wrapper title={title} handlers={{handleIfaceState, handleNavigate}} className={classes.padding}>
      <Prompt when message={this.prompt} />
      {iface_kind !== 'quick' && <Toolbar classes={classes} editor={editor} handlers={{handleNavigate}}/>}
      <Grid container>
        <Grid item xs={12} sm={12} lg={8} xl={9}>
          <Builder
            height={height}
            iface_kind={iface_kind}
            classes={classes}
            registerChild={(el) => this.editor = el}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4} xl={3}>
          <Controls editor={editor}/>
        </Grid>
      </Grid>
    </Wrapper>;
  }

}

Frame.propTypes = {
  handleIfaceState: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  windowHeight: PropTypes.number.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

export default withStyles(styles)(Frame);
