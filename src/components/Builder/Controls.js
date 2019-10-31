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
import {path} from '../App/menu_items';
import withStyles from '../CalcOrder/FrmObj/styles';
import Tip from './Tip';

class Controls extends React.Component {

  componentDidMount() {
    this.props.editor.project._dp._manager.on('update', this.onDataChange);
  }

  onDataChange = (obj, fields) => {
    if(obj === this.props.editor.project._dp && ('len' in fields || 'height' in fields)) {
      this.forceUpdate();
    }
  };

  render() {
    const {classes, handlers, editor} = this.props;
    const {_dp} = editor ? editor.project : {};
    return <FormGroup>

      <Typography color="textSecondary" display="block" variant="caption">Размеры</Typography>

      <div className={classes.flex}>
        {_dp && <DataField _obj={_dp} _fld="len" className={classes.w160}/>}

        {_dp && <DataField _obj={_dp} _fld="height" className={classes.w160}/>}
      </div>

      <div className={classes.bottom}/>

      <Divider />
      <Typography color="textSecondary" display="block" variant="caption">Дополнения</Typography>
      <FormControlLabel control={<Switch value="mosquito" />} label="Москитная сетка" />

    </FormGroup>;
  }
}


Controls.propTypes = {
  editor: PropTypes.object,
  handlers: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(Controls);
