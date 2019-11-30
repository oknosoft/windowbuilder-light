/**
 *
 *
 * @module MoneyDoc
 *
 * Created by Evgeniy Malyarov on 03.05.2019.
 */

import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';

import {withIface} from 'metadata-redux';
import DataField from 'metadata-react/DataField';
import TabularSection from 'metadata-react/TabularSection';
import DataObj from 'metadata-react/FrmObj/DataObj';
import withStyles600 from 'metadata-react/styles/paper600';

import OrderRow from './OrderRow';

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
    marginBottom: 8,
  },
})(Tabs);

class CalcOrderObj extends DataObj {

  constructor(props, context) {
    super(props, context);
    this.state.tab = 0;
    $p.cat.scheme_settings.find_rows({obj: 'doc.calc_order.production'}, (scheme) => {
      if(scheme.name.endsWith('parametric')) {
        this.scheme_parametric = scheme;
        scheme.filter = this.filterParametric;
      }
      else if(scheme.name.endsWith('nom')) {
        this.scheme_nom = scheme;
        scheme.filter = this.filterNom;
      }
    });
  }

  renderFields() {
    const {state: {_obj, tab}, props: {handlers, classes}}  = this;

    return <div style={{width: 'calc(100vw - 8px)', paddingBottom: 32}}>
      <AntTabs
        value={tab}
        onChange={this.handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        aria-label="full width tabs example"
      >
        <Tab label="Шапка" />
        <Tab label="Окна" />
        <Tab label="Доп" />
        <Tab label="Ном"  />
      </AntTabs>
      {tab === 0 && this.renderHead(_obj, classes)}
      {tab === 1 && this.renderProd(_obj, handlers)}
      {tab === 2 && this.renderParametric(_obj)}
      {tab === 3 && this.renderNom(_obj)}
    </div>;
  }

  renderHead(_obj, classes) {
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
      <DataField key="client_of_dealer" _obj={_obj} _fld="client_of_dealer" fullWidth/>,
      <DataField key="shipping_address"  _obj={_obj} _fld="shipping_address" fullWidth/>,
      <DataField key="note" _obj={_obj} _fld="note" fullWidth/>
    ];
  }

  renderProd(_obj, handlers) {
    const res = [
      <Button
        key="add-prod"
        variant="outlined"
        size="small"
        color="secondary"
        disabled={_obj.obj_delivery_state != 'Черновик'}
        onClick={this.openTemplates}
      >
        <AddIcon className="gl marginr" />
        Добавить изделие
      </Button>
    ];
    _obj.production.forEach((row) => {
      const {owner, calc_order} = row.characteristic;
      if(row.characteristic.empty() || calc_order.empty() || owner.is_procedure || owner.is_accessory) {
        return;
      }
      else if(row.characteristic.coordinates.count() == 0) {
        // возможно, это подчиненное изделие рисовалки
        if(row.characteristic.leading_product.calc_order == calc_order) {
          res.push(<OrderRow key={`or-${row.row}`} row={row} handlers={handlers}/>);
        }
      }
      else {
        // это изделие построителя
        res.push(<OrderRow key={`or-${row.row}`} row={row} handlers={handlers}/>);
      }
    });
    return res;
  }

  renderParametric(_obj) {
    return <div>
      <Typography variant="h6" color="primary">Параметрические изделия</Typography>
      {this.scheme_parametric && <TabularSection _obj={_obj} _tabular="production" scheme={this.scheme_parametric}/>}
      {!this.scheme_parametric && <Typography key="err-parametric" color="error">
        {`Не найден элемент scheme_settings {obj: "doc.calc_order.production", name: "production.parametric"}`}
      </Typography>}
    </div>;
  }

  filterParametric = (collection) => {
    const res = [];
    collection.forEach((row) => {
      const {owner, calc_order} = row.characteristic;
      if(row.characteristic.empty() || calc_order.empty() || owner.is_procedure || owner.is_accessory) {
        return;
      }
      else if(row.characteristic.coordinates.count() > 0) {
        return;
      }
      else {
        // это изделие параметрика
        res.push(row);
      }
    });
    return res;
  };

  renderNom(_obj) {
    const res = [<Typography key="title-nom" variant="h6" color="primary">Материалы и услуги без спецификации</Typography>];
    if(this.scheme_nom) {
      res.push(<TabularSection key="ts-nom" _obj={_obj} _tabular="production" scheme={this.scheme_nom}/>);
    }
    else {
      res.push(<Typography key="err-nom" color="error">
        {`Не найден элемент scheme_settings {obj: "doc.calc_order.production", name: "production.nom"}`}
      </Typography>);
    }
    return res;
  }

  filterNom = (collection) => {
    const res = [];
    collection.forEach((row) => {
      const {owner, calc_order} = row.characteristic;
      if(row.characteristic.empty() || calc_order.empty() || owner.is_procedure || owner.is_accessory) {
        // это обычная номенклатура
        res.push(row);
      }
    });
    return res;
  };

  openTemplates = () => {
    $p.ui.dialogs.alert({text: `Не реализовано`, title: 'Выбор шаблона'});
    // const {state: {_obj}, props: {handlers, _mgr}} = this;
    // handlers.handleNavigate(path(`cat.templates/list?order=${_obj.ref}&ref=new`));
  };

  handleChangeIndex = (tab) => {
    this.setState({tab});
  };

  handleChangeTab = (event, tab) => {
    this.setState({tab});
  };

  renderTabularSections() {
    return null;
  }
}

CalcOrderObj.rname = 'CalcOrderObj';

export default withStyles600(withIface(CalcOrderObj));
