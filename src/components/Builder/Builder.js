import React from 'react';
import PropTypes from 'prop-types';
import ContextMenu from './Toolbar/ContextMenu';

const initialState = {
  mouseX: null,
  mouseY: null,
  Component: null
};

export default class Builder extends React.Component {

  state = initialState;

  componentWillUnmount() {
    if (this.editor) {
      this.editor.unload();
      this.props.registerChild(this.editor = null);
      window.paper = null;
    }
  }

  createEditor(el) {
    if (el) {
      if (this.editor && this.editor._canvas === el) {
        const {project} = this.editor;
        //project.resize_canvas(width, height);
      }
      else {
        const {Editor, utils, cat} = $p;
        const editor = this.editor = new Editor(el);
        window.paper = editor;
        editor.create_tools(this);
        const {project, eve} = editor;

        const {order, action, skip} = utils.prm();
        project.load(this.props.match.params.ref)
          .then(() => {
            const {ox} = project;
            if (ox.is_new() || (order && ox.calc_order != order)) {
              ox.calc_order = order;
            }
            if (ox.calc_order.is_new()) {
              return ox.calc_order.load();
            }
          })
          .then(() => {
            const {ox} = project;
            if (!ox.calc_order.production.find(ox.ref, 'characteristic')) {
              const row = ox.calc_order.production.add({nom: ox.owner, characteristic: ox, quantity: 1});
              ox.product = row.row;
            }
            if (skip) {
              const {refill, sys, clr, params} = cat.templates._select_template;
              ox.base_block = '';
              if (!sys.empty()) {
                project.set_sys(sys, params, refill);
              }
              if (!clr.empty()) {
                ox.clr = clr;
              }
            } else if (action === 'refill' || action === 'new') {
              const {base_block} = cat.templates._select_template;
              if (ox.base_block != base_block && !base_block.empty()) {
                return project.load_stamp(base_block);
              }
            }
          })
          // .then(() => props.handleIfaceState({
          //   component: '',
          //   name: 'title',
          //   value: project.ox.prod_name(true),
          // }))
          .catch(console.log);
      }
    }
    this.editor && this.props.registerChild(this.editor);
  }

  handleContextMenu = (event) => {
    if (event.Component) {
      this.setState(event);
    } else {
      event.preventDefault?.();
      this.setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    }
  };

  handleCloseMenu = () => {
    this.setState(initialState);
  };

  arrowClick = (btn) => () => {
    if (this.editor && this.editor.tool) {
      this.editor.tool.emit('keydown', {
        key: btn,
        modifiers: {}
      });
    }
  };

  render() {
    const {props: {classes}, state, editor} = this;
    return <div onContextMenu={this.handleContextMenu} className={classes.builder}>
      <canvas
        className={classes.canvas}
        ref={(el) => this.createEditor(el)}
      />
      <ContextMenu {...state} editor={editor} handleClose={this.handleCloseMenu}/>
    </div>;
  }
}

Builder.propTypes = {
  registerChild: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
