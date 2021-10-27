/**
 * Каркас графического редактора
 *
 * @module Frame
 *
 * Created by Evgeniy Malyarov on 26.09.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {Prompt} from 'react-router-dom';
import {Resize, ResizeHorizon} from 'metadata-react/Resize';
import Toolbar from './Toolbar';
import Builder from './Builder';
import Controls from './Controls';
import ProductStructure from './ProductStructure';

const styles = ({spacing}) => ({
  canvas: {
    margin: 2,
    width: '100%',
    height: '100%',
    backgroundColor: grey[50],
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    backgroundColor: grey[200],
  },
  padding: {
    paddingLeft: spacing(),
    paddingRight: spacing(),
  },
});

const ltitle = 'Редактор';

class Frame extends React.Component {

  constructor() {
    super();
    this.state = {
      ox_opened: false,
      editor: null,
      elm: null,
      layer: null,
      tool: null,
      type: 'root',
    };
  }

  componentDidMount() {
    const {props, editor} = this;

    props.handleIfaceState({
      component: '',
      name: 'title',
      value: ltitle,
    });
  }

  componentWillUnmount() {
    const {editor} = this.state;
    editor && editor.eve.off({
      elm_activated: this.elm_activated,
    });
  }

  registerChild = (editor) => {
    if(editor !== this.state.editor) {
      editor && editor.eve.on({
        elm_activated: this.elm_activated,
      });
      this.setState({editor});
    }
  };

  handleClose = () => {
    const {state: {editor}, props} = this;
    if(editor) {
      const {calc_order, ref} = editor.project.ox;
      const order = calc_order.empty() ? 'list' : `${calc_order.ref}?ref=${ref}`;
      props.handleNavigate(`/doc.calc_order/${order}`);
    }
  };

  openTemplate = () => {
    const {state: {editor}, props: {handleNavigate}} = this;
    if(editor) {
      const {ox} = editor.project;
      if(ox.empty() || ox.calc_order.empty()) {
        $p.ui.dialogs.alert({text: `Пустая ссылка изделия или заказа`, title: 'Ошибка данных'});
      }
      else {
        handleNavigate(`/templates/?order=${ox.calc_order.ref}&ref=${ox.ref}`);
      }
    }
  };

  resizeStop = (inf) => {
    const {editor} = this.state;
    if(editor) {
      const {offsetWidth, offsetHeight} = editor.view.element.parentNode;
      editor.project.resize_canvas(offsetWidth, offsetHeight);
    }
  };

  open_ox = () => this.setState({ox_opened: true});
  close_ox = () => this.setState({ox_opened: false});

  /**
   * проверка, можно ли покидать страницу
   * @return {String|Boolean}
   */
  prompt = (loc) => {
    const {editor} = this.state;
    if(!editor || !editor.project || loc.pathname.includes('templates')) {
      return true;
    }
    const {ox} = editor.project;
    return ox && ox._modified ? `Изделие ${ox.prod_name(true)} изменено.\n\nЗакрыть без сохранения?` : true;
  };

  tree_select = ({type, elm, layer}) => {
    this.setState({type, elm, layer});
  };

  elm_activated = (elm) => {
    const {selected_elements} = elm.project;
    if(selected_elements.length === 2) {
      this.tree_select({type: 'pair', elm: selected_elements});
    }
    else if(selected_elements.length > 2) {
      this.tree_select({type: 'grp', elm: selected_elements});
    }
    else {
      this.tree_select({type: 'elm', elm});
    }
  };

  render() {
    const {
      props: {classes, match},
      state: {editor, elm, layer, tool, type},
    } = this;
    const width = innerWidth;

    return <>
      <Prompt when message={this.prompt} />
      {editor && <Toolbar
        classes={classes}
        editor={editor}
        handleClose={this.handleClose}
        openTemplate={this.openTemplate}
        open_ox={this.open_ox}
      />}
      <div style={{position: 'relative', height: 'calc(100vh - 98px)'}}>
        <Resize handleWidth="6px" handleColor={grey[200]} onResizeStop={this.resizeStop} onResizeWindow={this.resizeStop}>
          <ResizeHorizon width={`${(width / 6).toFixed()}px`} minWidth="200px">
            {editor ?
              <ProductStructure
                editor={editor}
                type={type}
                elm={elm}
                layer={layer}
                onSelect={this.tree_select}
              /> :
              'Загрузка...'
            }
          </ResizeHorizon>
          <ResizeHorizon width={`${(width * 7 / 12).toFixed()}px`} minWidth="600px">
            <Builder
              classes={classes}
              match={match}
              registerChild={this.registerChild}
            />
          </ResizeHorizon>
          <ResizeHorizon overflow="hidden auto" width={`${(width * 3 / 12).toFixed()}px`} minWidth="200px">
            {editor ? <Controls
              editor={editor}
              type={type}
              elm={elm}
              layer={layer}
            /> :
              'Загрузка...'
            }
          </ResizeHorizon>
        </Resize>
      </div>
    </>;
  }
}

Frame.propTypes = {
  handleIfaceState: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  title: PropTypes.string,
};

export default withStyles(styles)(Frame);
