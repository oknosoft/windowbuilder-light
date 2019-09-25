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
        <DataField read_only _obj={_obj} _fld="number_doc"/>
        <DataField read_only _obj={_obj} _fld="number_internal"/>
        <DataField read_only _obj={_obj} _fld="date"/>
      </FormGroup>,
      <DataField key="client_of_dealer" _obj={_obj} _fld="client_of_dealer"/>,
      <DataField key="shipping_address"  _obj={_obj} _fld="shipping_address"/>
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
