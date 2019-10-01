/**
 *
 *
 * @module MoneyDoc
 *
 * Created by Evgeniy Malyarov on 03.05.2019.
 */

import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import DataField from 'metadata-react/DataField';
import DataObj from 'metadata-react/FrmObj/DataObj';
import withStyles from 'metadata-react/styles/paper600';
import {withIface} from 'metadata-redux';
import OrderRow from './OrderRow';

class CalcOrderObj extends DataObj {

  renderFields() {
    const {state: {_obj}, props: {classes}} = this;

    return [
      <FormGroup row key="group_sys">
        <DataField _obj={_obj} _fld="number_doc"/>
        <DataField _obj={_obj} _fld="number_internal"/>
        <DataField _obj={_obj} _fld="date"/>
      </FormGroup>,
      <FormGroup row key="row1">
        <DataField _obj={_obj} _fld="organization"/>
        <DataField _obj={_obj} _fld="partner"/>
        <DataField _obj={_obj} _fld="department"/>
      </FormGroup>,
      <FormGroup row key="row2" className={classes.paddingBottom}>
        <DataField _obj={_obj} _fld="manager"/>
        <DataField _obj={_obj} _fld="leading_manager"/>
        <DataField _obj={_obj} _fld="doc_amount" read_only/>
      </FormGroup>,
      <DataField key="client_of_dealer" _obj={_obj} _fld="client_of_dealer"/>,
      <DataField key="shipping_address"  _obj={_obj} _fld="shipping_address"/>
    ];
  }

  renderTabularSections() {
    const {state: {_obj}, props: {handlers}}  = this;
    const res = [];
    _obj.production.forEach((row) => res.push(<OrderRow key={`or-${row.row}`} row={row} handlers={handlers}/>));
    res.push(<DataField key="note" _obj={_obj} _fld="note"/>);
    return res;
  }
}

CalcOrderObj.rname = 'CalcOrderObj';

export default withStyles(withIface(CalcOrderObj));
