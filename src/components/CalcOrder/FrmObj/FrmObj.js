import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

import {withIface} from 'metadata-redux';
import DataField from 'metadata-react/DataField';
import TabularSection from 'metadata-react/TabularSection';
import DataObj from 'metadata-react/FrmObj/DataObj';
import withStyles600 from 'metadata-react/styles/paper600';

import Tip from 'windowbuilder-forms/dist/Common/Tip';
import {Tabs, Tab} from 'windowbuilder-forms/dist/Common/AntTabs';

import DataObjToolbar from './DataObjToolbar';
import OrderRow from './OrderRow';
import Parametric from './Parametric';
import {path, prm} from '../../App/menu_items';

class CalcOrderObj extends DataObj {

  constructor(props, context) {
    super(props, context);
    const {ref} = prm();
    this.state.tab = ref ? 1 : 0;
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
    const {state: {_obj, tab}, props: {handlers, classes, height}}  = this;
    let h1 = height < 420 ? 420 : height;
    h1 -= 146;

    return <div style={{paddingBottom: 32}}>
      <Tabs
        value={tab}
        onChange={this.handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
      >
        <Tab label={<Tip title="Реквизиты заказа"><i className="fa fa-file-text-o fa-fw"></i></Tip>}/>
        <Tab label={<Tip title="Изделия построителя"><i className="fa fa-object-ungroup fa-fw"></i></Tip>}/>
        <Tab label={<Tip title="Параметрические изделия"><i className="fa fa-gavel fa-fw"></i></Tip>}/>
        <Tab label={<Tip title="Материалы и услуги без спецификации"><i className="fa fa-cube fa-fw"></i></Tip>}/>
      </Tabs>
      {tab === 0 && this.renderHead(_obj, classes)}
      {tab === 1 && this.renderProd(_obj, handlers)}
      {tab === 2 && <Parametric _obj={_obj} height={h1} scheme={this.scheme_parametric}/>}
      {tab === 3 && this.renderNom(_obj, h1)}
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
    const is_technologist = $p.current_user.role_available('ИзменениеТехнологическойНСИ');
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
          res.push(<OrderRow key={`or-${row.row}`} row={row} handlers={handlers} is_technologist={is_technologist}/>);
        }
      }
      else {
        // это изделие построителя
        res.push(<OrderRow key={`or-${row.row}`} row={row} handlers={handlers} is_technologist={is_technologist}/>);
      }
    });
    return res;
  }

  filterParametric = (collection) => {
    const res = [];
    collection.forEach((row) => {
      const {calc_order} = row.characteristic;
      if(row.characteristic.empty() || calc_order.empty() || !row.ordn.empty()) {
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

  filterNom = (collection) => {
    const res = [];
    collection.forEach((row) => {
      if(row.ordn.empty() && (row.characteristic.empty() || row.characteristic.calc_order.empty())) {
        // это обычная номенклатура
        res.push(row);
      }
    });
    return res;
  };

  renderNom(_obj, height) {
    return <div style={{height}}>
      <Typography key="title-nom" variant="h6" color="primary">Товары и услуги без спецификации</Typography>
      {this.scheme_nom && <TabularSection key="ts-nom" _obj={_obj} _tabular="production" scheme={this.scheme_nom} denyReorder/>}
      {!this.scheme_nom && <Typography key="err-nom" color="error">
        {`Не найден элемент scheme_settings {obj: "doc.calc_order.production", name: "production.nom"}`}
      </Typography>}
    </div>;
  }

  openTemplates = () => {
    const {state: {_obj}, props: {handlers}} = this;
    ((_obj._modified || _obj.is_new()) ? _obj.save() : Promise.resolve())
      .then(() => handlers.handleNavigate(path(`templates/?order=${_obj.ref}&ref=new`)))
      .catch((err) => null);
  };

  get Toolbar() {
    return DataObjToolbar;
  }

  handleChangeTab = (event, tab) => {
    this.setState({tab});
  };

  renderTabularSections() {
    return null;
  }
}

CalcOrderObj.rname = 'CalcOrderObj';

export default withStyles600(withIface(CalcOrderObj));
