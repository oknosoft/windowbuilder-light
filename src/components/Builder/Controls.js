/**
 * Элементы управления рисовалкой
 *
 * @module Controls
 *
 * Created by Evgeniy Malyarov on 01.10.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Tip from './Tip';
import Params from './Params/Params';
import ToolWnd from './ToolWnds/ToolWnd';
import {AntTabs} from '../CalcOrder/FrmObj/FrmObj';
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

  state = {tab: 0};

  componentDidMount() {
    const {editor} = this.props;
    editor.project._dp._manager.on('update', this.onDataChange);
    editor.eve.on('layer_activated', this.layer_activated);
    editor.eve.on('tool_activated', this.tool_activated);
  }

  layer_activated = (contour, custom) => {
    !custom && this.forceUpdate();
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

  onDataChange = (obj, fields) => {
    if(obj === this.props.editor.project._dp && ('len' in fields || 'height' in fields)) {
      this.forceUpdate();
    }
  };

  handleChangeTab = (event, tab) => {
    this.setState({tab});
  };

  render() {
    const {props: {editor, classes}, state: {tab}}  = this;
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
      {tab === 2 && <Params editor={editor}/>}
      {tab === 3 && <Params editor={editor} root/>}
      {tab === 4 && <ToolWnd editor={editor}/>}
    </div>;
  }
}


Controls.propTypes = {
  editor: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Controls);
