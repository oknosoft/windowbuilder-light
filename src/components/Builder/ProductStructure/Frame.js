/**
 * Дерево слоёв, элементов и вставок
 * https://github.com/oknosoft/windowbuilder/issues/575
 *
 */


import React from 'react';
import PropTypes from 'prop-types';
import {Treebeard, decorators, filters} from 'wb-forms/dist/Treebeard';
import Menu from './Menu';
import get_struct from './get_struct';
import Toolbar from './Toolbar';
import './designer.css';

const shiftKeys = ['Control', 'Shift'];

export default class FrameTree extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      struct: {},
      current: null,
      anchorEl: null,
      menuItem: null,
    };
    this.ctrlKeyDown = false;
    this.ch_timer = 0;
  }

  componentDidMount() {
    const {eve, project} = this.props.editor;
    eve.on({
      // layer_activated: this.layer_activated,
      // tool_activated: this.tool_activated,
      // furn_changed: this.furn_changed,
      // refresh_prm_links: this.refresh_prm_links,
      // contour_redrawed: this.contour_redrawed,
      scheme_changed: this.scheme_changed,
      loaded: this.scheme_changed,
      // set_inset: this.set_inset,
      // coordinates_calculated: this.coordinates_calculated,
    });
    project._dp._manager.on('update', this.dp_listener);
    window.addEventListener('keydown', this.onKeyDown, {passive: true});
    window.addEventListener('keyup', this.onKeyUp, {passive: true});
  }

  componentWillUnmount() {
    const {eve, project} = this.props.editor;
    eve.off({
      // layer_activated: this.layer_activated,
      // tool_activated: this.tool_activated,
      // furn_changed: this.furn_changed,
      // refresh_prm_links: this.refresh_prm_links,
      // contour_redrawed: this.contour_redrawed,
      scheme_changed: this.scheme_changed,
      loaded: this.scheme_changed,
      // set_inset: this.set_inset,
      // coordinates_calculated: this.coordinates_calculated,
    });
    project._dp._manager.off('update', this.dp_listener);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {elm, type, layer} = nextProps;
    const {current, struct} = nextState;

    if (type === 'pair' || type === 'grp') {
      struct.deselect();
      for(const sub of elm) {
        const node = struct.find_node(sub);
        if (node) {
          node.active = true;
        }
      }
    }
    if (type === 'elm' ) {
      const node = struct.find_node(elm);
      if (node && !node.active) {
        struct.deselect();
        node.active = true;
        node.expand();
        if(current !== node) {
          this.setState({current: node});
          return false;
        }
      }
    }
    return true;
  }

  // при готовности снапшота, обновляем суммы и цены
  scheme_changed = (force) => {
    if(this.ch_timer) {
      clearTimeout(this.ch_timer);
      this.ch_timer = 0;
    }
    if(!force) {
      this.ch_timer = setTimeout(this.scheme_changed.bind(this, true), 100);
      return;
    }
    const {editor} = this.props;
    this.setState({struct: get_struct(editor.project)});
  };

  handleMenuOpen = (node, {currentTarget}) => {
    this.setState({menuItem: node, anchorEl: currentTarget});
  }

  handleMenuClose = () => {
    this.handleMenuOpen(null, {currentTarget: null});
  }

  onToggle = (node, toggled) => {
    if (node.children) {
      node.toggled = toggled;
    }
    this.forceUpdate();
  };

  onClickHeader = (node) => {
    const {props: {editor}, state: {struct}, ctrlKeyDown} = this;
    const deselect = () => {
      editor.cmd('deselect', [{elm: null, node: null}]);
      struct.deselect();
    };
    node.active = true;

    const {Editor} = $p;
    const event = {node, layer: null, elm: null, inset: null};
    if(node._owner instanceof Editor.Scheme) {
      event.type = 'root';
      deselect();
    }
    else if(node._owner instanceof Editor.BuilderElement) {
      event.type = 'elm';
      event.elm = node._owner;
      if(ctrlKeyDown) {
        if(node._owner.selected) {
          editor.cmd('deselect', [{elm: node._owner.elm, node: null, shift: ctrlKeyDown}]);
        }
        else {
          node.active = true;
          editor.cmd('select', [{elm: node._owner.elm, node: null, shift: ctrlKeyDown}]);
        }
      }
      else {
        deselect();
        editor.cmd('select', [{elm: node._owner.elm, node: null, shift: ctrlKeyDown}]);
      }

    }
    else if(node._owner instanceof Editor.Contour) {
      event.type = 'layer';
      event.layer = node._owner;
      deselect();
    }

    this.setState({current: node});
    this.props.onSelect(event);
  };

  applyFilter = (v) => {
    if (v !== undefined) {
      if (this._timout) clearTimeout(this._timout);
      this._filter = v;
      this._timout = setTimeout(this.applyFilter, 600);
    } else {
      const {_filter, props: {editor}} = this;
      const struct = get_struct(editor.project);
      if (!_filter) {
        return this.setState({struct});
      }
      Promise.resolve()
        .then(() => filters.filterTree(struct, _filter))
        .then((filtered) => filters.expandFilteredNodes(filtered, _filter))
        .then((filtered) => this.setState({struct: filtered}));
    }
  };

  onFilterMouseUp = ({target}) => {
    this.applyFilter(target.value.trim());
  };

  onKeyDown = ({key}) => {
    if(shiftKeys.includes(key)) {
      this.ctrlKeyDown = true;
    }
  };

  onKeyUp = ({key}) => {
    if(shiftKeys.includes(key)) {
      this.ctrlKeyDown = false;
    }
  };

  render() {
    const {state: {anchorEl, menuItem, struct, current}, props}  = this;

    return (
      <>
        <Toolbar {...props}/>
        <div className="dsn-search-box">
          <input type="text" className="dsn-input" placeholder="Найти..." onKeyUp={this.onFilterMouseUp}/>
        </div>
        <div className="dsn-tree" ref={node => this.node = node}>
          <Treebeard
            data={struct}
            decorators={decorators}
            separateToggleEvent={true}
            onToggle={this.onToggle}
            onClickHeader={this.onClickHeader}
            onRightClickHeader={this.handleMenuOpen}
          />
        </div>
        <Menu item={menuItem} anchorEl={anchorEl} handleClick={this.handleMenuClose}
              handleClose={this.handleMenuClose}/>
      </>
    );
  }
}

FrameTree.propTypes = {
  editor: PropTypes.object.isRequired,
};
