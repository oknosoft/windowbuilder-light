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
import {Resize, ResizeHorizon, ResizeVertical} from 'metadata-react/Resize';
import Toolbar from './Toolbar';
import Builder from './Builder';
import Controls from './Controls';
import ProductStructure from './ProductStructure';
import NotiContent from '../Notifications/Content';
import noti_connect from '../Notifications/connect';
const FrmCalcOrderObj = React.lazy(() => import('../CalcOrder/FrmObj'));

const styles = ({spacing}) => ({
  canvas: {
    margin: 2,
    width: '100%',
    height: '100%',
    backgroundColor: grey[50],
  },
  builder: {
    cursor: 'context-menu',
    height: '100%',
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
  sketch_view: {
    position: 'absolute',
    left: 8,
    top: 8,
    userSelect: 'none',
    pointerEvents: 'none',
  }
});

const ltitle = 'Редактор';

class Frame extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      editor: null,
      elm: null,
      layer: null,
      tool: null,
      type: 'root',
      order: '',
      sketch_view: '',
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
    editor?.eve?.off({
      elm_activated: this.elm_activated,
      coordinates_calculated: this.coordinates_calculated,
      loaded: this.coordinates_calculated,
      mirror_change: this.mirror_change,
    });
  }

  registerChild = (editor) => {
    if (editor !== this.state.editor) {
      editor?.eve?.on({
        elm_activated: this.elm_activated,
        coordinates_calculated: this.coordinates_calculated,
        loaded: this.coordinates_calculated,
        mirror_change: this.mirror_change,
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
    if (editor) {
      const {ox} = editor.project;
      if (ox.empty() || ox.calc_order.empty()) {
        $p.ui.dialogs.alert({text: `Пустая ссылка изделия или заказа`, title: 'Ошибка данных'});
      }
      else {
        handleNavigate(`/templates/?order=${ox.calc_order.ref}&ref=${ox.ref}`);
      }
    }
  };

  resizeStop = (inf) => {
    const {editor} = this.state;
    if (editor) {
      const {offsetWidth, offsetHeight} = editor.view.element.parentNode;
      editor.project.resize_canvas(offsetWidth, offsetHeight);
    }
  };

  /**
   * проверка, можно ли покидать страницу
   * @return {String|Boolean}
   */
  prompt = (loc) => {
    const {editor} = this.state;
    if (!editor || !editor.project || loc.pathname.includes('templates')) {
      return true;
    }
    const {ox} = editor.project;
    return ox && ox._modified ? `Изделие ${ox.prod_name(true)} изменено.\n\nЗакрыть без сохранения?` : true;
  };

  tree_select = ({type, elm, layer}) => {
    this.setState({type, elm, layer});
  };

  elm_activated = (elm) => {
    const {Contour} = this.state.editor.constructor;
    if(!elm) {
      this.tree_select({type: 'root', elm});
    }
    else if(elm instanceof Contour) {
      this.tree_select({type: 'layer', layer: elm, elm: null});
    }
    else {
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
    }
  };

  render() {
    const {props: {classes, match}, state: {editor, noti, elm, layer, tool, type, order, sketchView}} = this;
    const width = innerWidth;

    return <>
      <Prompt when message={this.prompt}/>
      {editor && <Toolbar
        classes={classes}
        editor={editor}
        handleClose={this.handleClose}
        openTemplate={this.openTemplate}
        noti={noti}
      />}
      <div style={{position: 'relative', height: 'calc(100vh - 49px)'}}>
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
          <ResizeHorizon overflow="hidden auto" width={`${(width * 3 / 12).toFixed()}px`} minWidth="280px">
            {noti.open ? <NotiContent {...noti}/> :
              <Controls
                editor={editor}
                type={type}
                elm={elm}
                layer={layer}
                tree_select={this.tree_select}
              />
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
  match: PropTypes.object.isRequired,
  title: PropTypes.string,
};

export default withStyles(styles)(noti_connect(Frame));
