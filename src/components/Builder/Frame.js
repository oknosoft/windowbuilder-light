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

import {Prompt} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import Builder from './Builder';
import Toolbar from './Toolbar';
import Controls from './Controls';
import {path, prm} from '../App/menu_items';

const styles = ({spacing}) => ({
  content: {
    padding: spacing(),
  },
  canvas: {
    marginLeft: spacing() / 2,
    marginTop: spacing() / 2,
    //backgroundColor: '#f9fbfa',
  },
  title: {
    flexGrow: 1,
  },
  padding: {
    paddingLeft: spacing(),
    paddingRight: spacing(),
  },
});

const ltitle = 'Редактор';

class Frame extends React.Component {


  componentDidMount() {
    const {props, editor} = this;
    props.handleIfaceState({
      component: '',
      name: 'title',
      value: ltitle,
    });
    if(editor) {
      const {project} = editor;
      const {order, action} = prm();
      project.load(props.match.params.ref)
        .then(() => {
          const {ox} = project;
          if(ox.is_new() || (order && ox.calc_order != order)) {
            ox.calc_order = order;
          }
          if(ox.calc_order.is_new()) {
            return ox.calc_order.load();
          }
        })
        .then(() => {
          const {ox} = project;
          if(!ox.calc_order.production.find(ox.ref, 'characteristic')) {
            const row = ox.calc_order.production.add({characteristic: ox});
            ox.product = row.row;
          }
          if(action === 'refill' || action === 'new') {
            const {base_block} = $p.cat.templates._select_template;
            if(ox.base_block != base_block && !base_block.empty()) {
              return project.load_stamp(base_block);
            }
          }
        })
        .then(() => props.handleIfaceState({
          component: '',
          name: 'title',
          value: project.ox.prod_name(true),
        }))
        .catch(console.log);
    }
  }

  handleClose = () => {
    const {editor, props} = this;
    if(editor) {
      const {calc_order, ref} = editor.project.ox;
      const order = calc_order.empty() ? 'list' : `${calc_order.ref}?ref=${ref}`;
      props.handleNavigate(path(`doc.calc_order/${order}`));
    }
  };

  openTemplate = () => {
    const {editor, props: {handleNavigate}} = this;
    if(editor) {
      const {ox} = editor.project;
      if(ox.empty() || ox.calc_order.empty()) {
        $p.ui.dialogs.alert({text: `Пустая ссылка изделия или заказа`, title: 'Ошибка данных'});
      }
      else {
        handleNavigate(path(`templates/?order=${ox.calc_order.ref}&ref=${ox.ref}`));
      }
    }
  };

  registerChild = (el) => this.editor = el;

  /**
   * проверка, можно ли покидать страницу
   * @return {String|Boolean}
   */
  prompt = (loc) => {
    const {editor} = this;
    if(!editor || !editor.project || loc.pathname.includes('templates')) {
      return true;
    }
    const {ox} = editor.project;
    return ox && ox._modified ? `Изделие ${ox.prod_name(true)} изменено.\n\nЗакрыть без сохранения?` : true;
  };

  render() {
    const {editor, props: {classes, windowHeight, windowWidth}} = this;
    let height = (windowWidth > 720 ? (windowHeight - 56) : windowWidth * 0.7) - 50;
    if(height < 320) {
      height = 320;
    }
    return <div>
      <Prompt when message={this.prompt} />
      {editor && <Toolbar
        classes={classes}
        editor={editor}
        handleClose={this.handleClose}
        openTemplate={this.openTemplate}
      />}
      <Grid container>
        <Grid item xs={12} sm={12} lg={8} xl={9}>
          <Builder
            height={height}
            classes={classes}
            registerChild={this.registerChild}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4} xl={3}>
          {editor && <Controls editor={editor}/>}
        </Grid>
      </Grid>

    </div>;
  }

}

Frame.propTypes = {
  handleIfaceState: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  windowHeight: PropTypes.number.isRequired,
  windowWidth: PropTypes.number.isRequired,
  title: PropTypes.string,
};

export default withStyles(styles)(Frame);
