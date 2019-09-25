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
import TabularSection from 'metadata-react/TabularSection';
import DataObj from 'metadata-react/FrmObj/DataObj';
import withStyles from 'metadata-react/styles/paper600';
import {withIface} from 'metadata-redux';

class CalcOrderObj extends DataObj {

  renderFields() {
    const {state: {_meta: {fields}, _obj}, props: {classes}} = this;

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
      <DataField _obj={_obj} _fld="client_of_dealer"/>,
      <DataField _obj={_obj} _fld="shipping_address"/>
    ];
  }

  renderTabularSections() {
    const {_obj} = this.state;

    return [
      <FormGroup key="rows" style={{height: 300}}>
        <TabularSection _obj={_obj} _tabular="production"/>
      </FormGroup>,
      <DataField key="note" _obj={_obj} _fld="note"/>
    ];
  }
}

CalcOrderObj.rname = 'CalcOrderObj';

export default withStyles(withIface(CalcOrderObj));
