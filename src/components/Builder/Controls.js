/**
 * Элементы управления рисовалкой
 *
 * @module Controls
 *
 * Created by Evgeniy Malyarov on 01.10.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';

import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import DataField from 'metadata-react/DataField';
import Tip from './Tip';
import Params from './Params/Params';
import {AntTabs} from '../CalcOrder/FrmObj/FrmObj';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
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
  }

  layer_activated = (contour, custom) => {
    !custom && this.forceUpdate();
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
    const {props: {handlers, editor, classes}, state: {tab}}  = this;
    const {_dp} = editor ? editor.project : {};
    return <div>
      <AntTabs
        value={tab}
        onChange={this.handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
      >
        <Tab classes={{root: classes.tabRoot}} icon={<i className="fa fa-sitemap fa-fw"></i>} title="Слои изделия"/>
        <Tab classes={{root: classes.tabRoot}} icon={<i className="fa fa-puzzle-piece fa-fw"></i>} title="Свойства элемента" />
        <Tab classes={{root: classes.tabRoot}} icon={<i className="fa fa-object-ungroup fa-fw"></i>} title="Свойства створки" />
        <Tab classes={{root: classes.tabRoot}} icon={<i className="fa fa-picture-o fa-fw"></i>} title="Свойства изделия"  />
      </AntTabs>
      {tab === 2 && <Params editor={editor}/>}
      {tab === 3 && <Params editor={editor} root/>}
    </div>;
  }
}


Controls.propTypes = {
  editor: PropTypes.object,
  handlers: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Controls);
