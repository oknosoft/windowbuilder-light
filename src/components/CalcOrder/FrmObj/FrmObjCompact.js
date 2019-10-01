/**
 * doc.calc_order/d0e56670-d129-11e9-a38f-c343d95aab02
 */

import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import DataField from 'metadata-react/DataField';
import TabularSection from 'metadata-react/TabularSection';
import DataObj from 'metadata-react/FrmObj/DataObj';
import withStyles from 'metadata-react/styles/paper600';
import {withIface} from 'metadata-redux';
import Wrapper from '../../App/Wrapper';
import OrderRow from './OrderRow';
import Toolbar from './ToolbarCompact';
import CloseBtn from './CloseBtn';

class CalcOrderObj extends DataObj {

  renderFields() {
    const {state: {_meta: {fields}, _obj}, props: {classes}} = this;

    return [
      <FormGroup row key="group_sys">
        <DataField read_only _obj={_obj} _fld="number_doc"/>
        <DataField read_only _obj={_obj} _fld="number_internal"/>
        <DataField read_only _obj={_obj} _fld="date"/>
      </FormGroup>,
      <DataField key="client_of_dealer" _obj={_obj} _fld="client_of_dealer"/>,
      <DataField key="shipping_address"  _obj={_obj} _fld="shipping_address"/>
    ];
  }

  renderTabularSections() {
    const {state: {_obj}, props: {handlers}}  = this;
    const res = [<Toolbar _obj={_obj} handlers={handlers}/>];
    _obj.production.forEach((row) => res.push(<OrderRow key={`or-${row.row}`} row={row} handlers={handlers}/>));
    res.push(<DataField key="note" _obj={_obj} _fld="note"/>);
    return res;
  }

  get Toolbar() {
    return () => null;
  }

  render() {
    const {props: {title, handlers}, _handlers} = this;
    return <Wrapper title={title} handlers={handlers} CustomBtn={<CloseBtn handleClose={_handlers.handleClose}/>}>
      {super.render()}
    </Wrapper>;
  }
}

CalcOrderObj.rname = 'CalcOrderObj';

export default withStyles(withIface(CalcOrderObj));
