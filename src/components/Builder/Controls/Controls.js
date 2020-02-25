/**
 * Элементы управления рисовалкой
 *
 * @module Controls
 *
 * Created by Evgeniy Malyarov on 01.10.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Tip from '../Tip';
import Product from './Product';
import Flap from './Flap';
import LayersTree from './LayersTree';
import ElmProps from './ElmProps';
import ToolWnd from '../ToolWnds/ToolWnd';
import {AntTabs} from '../../CalcOrder/FrmObj/FrmObj';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  tabRoot: {
    '@media (min-width: 600px)': {
      minWidth: 72
    }
  }
});

class Controls extends React.Component {

  state = {
    tab: 0,
    elm1: null,
    elm2: null,
  };

  componentDidMount() {
    const {editor} = this.props;
    editor.project._dp._manager.on('update', this.onDataChange);
    editor.eve.on('layer_activated', this.layer_activated);
    editor.eve.on('tool_activated', this.tool_activated);
    editor.eve.on('elm_activated', this.elm_activated);
    editor.eve.on('contour_redrawed', this.contour_redrawed);
  }

  layer_activated = (contour, custom) => {
    if(!custom) {
      contour && contour.project.activeLayer !== contour && contour.activate();
      this.forceUpdate();
    }
  };

  tool_activated = (tool) => {
    if(tool.ToolWnd) {
      if(this.state.tab !== 4) {
        this.setState({tab: 4});
      }
      else {
        this.forceUpdate();
      }
    }
    else {
      if(this.state.tab === 4) {
        this.setState({tab: 1});
      }
    }

  };

  elm_activated = (elm, shift) => {
    const {elm1, elm2} = this.state;
    if(!elm1 || !shift || elm1 === elm) {
      this.setState({elm1: elm, elm2: null});
    }
    else if((shift && elm2 === elm)) {
      this.setState({elm1: elm1, elm2: null});
    }
    else {
      this.setState({elm2: elm});
    }
  };

  contour_redrawed = () => {
    const {props, _reflect_id} = this;
    if(props.editor){
      _reflect_id && clearTimeout(_reflect_id);
      this._reflect_id = setTimeout(this.reflect_changes, 100);
    }
  };

  reflect_changes = () => {
    const {props: {editor}} = this;
    if(editor && editor.project) {
      const {_dp, bounds, area} = editor.project;
      _dp.len = bounds.width.round();
      _dp.height = bounds.height.round();
      _dp.s = area;
    }
  };

  onDataChange = (obj, fields) => {
    if(obj === this.props.editor.project._dp && ('len' in fields || 'height' in fields)) {
      this.forceUpdate();
    }
  };

  handleChangeTab = (event, tab) => {
    this.setState({tab});
  };

  render() {
    const {props: {editor, classes}, state: {tab, elm1, elm2}}  = this;
    //const {_dp} = editor ? editor.project : {};
    return <div>
      <AntTabs
        value={tab}
        onChange={this.handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
      >
        <Tab
          classes={{root: classes.tabRoot}}
          label={
            <Tip title="Слои изделия" placement="top">
              <i className="fa fa-sitemap fa-fw"></i>
            </Tip>
          }/>
        <Tab
          classes={{root: classes.tabRoot}}
          label={
            <Tip title="Свойства элемента" placement="top">
              <i className="fa fa-puzzle-piece fa-fw"></i>
            </Tip>
          }/>
        <Tab
          classes={{root: classes.tabRoot}}
          label={
            <Tip title="Свойства створки" placement="top">
              <i className="fa fa-object-ungroup fa-fw"></i>
            </Tip>
          }/>
        <Tab
          classes={{root: classes.tabRoot}}
          label={
            <Tip title="Свойства изделия" placement="top">
              <i className="fa fa-picture-o fa-fw"></i>
            </Tip>
          }/>
        <Tab
          classes={{root: classes.tabRoot}}
          label={
            <Tip title="Свойства инструмента" placement="top">
              <i className="fa fa-cogs fa-fw"></i>
            </Tip>
          }/>
      </AntTabs>
      {tab === 0 && <LayersTree editor={editor}/>}
      {tab === 1 && <ElmProps editor={editor} elm1={elm1} elm2={elm2}/>}
      {tab === 2 && <Flap editor={editor}/>}
      {tab === 3 && <Product editor={editor}/>}
      {tab === 4 && <ToolWnd editor={editor}/>}
    </div>;
  }
}


Controls.propTypes = {
  editor: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Controls);
