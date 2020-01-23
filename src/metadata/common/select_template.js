/**
 *
 *
 * @module select_template
 *
 * Created by Evgeniy Malyarov on 24.12.2019.
 */

export default function ({classes, cat: {characteristics, templates, params_links}, utils}) {

  class FakeSelectTemplate extends classes.BaseDataObj {

    constructor() {
      //calc_order, base_block, sys, template_props, refill
      super({}, characteristics, false, true);
      this._data._is_new = false;
      this._meta = utils._clone(characteristics.metadata());
      this._meta.fields.template_props = templates.metadata('template_props');
      this._meta.fields.refill = utils._clone(params_links.metadata('hide'));
      this._meta.tabular_sections = {};
    }


    _metadata(fld) {
      return fld ? this._meta.fields[fld] : this._meta;
    }

    get calc_order() {
      return this._getter('calc_order');
    }
    set calc_order(v) {
      this._setter('calc_order', v);
    }

    get base_block() {
      return this._getter('base_block');
    }
    set base_block(v) {
      this._setter('base_block', v);
      this.sys = this.base_block.sys;
    }

    get refill() {
      return this._getter('refill');
    }
    set refill(v) {
      this._setter('refill', v);
    }

    get sys() {
      return this._getter('sys');
    }
    set sys(v) {
      this._setter('sys', v);
    }

    get template_props() {
      return this._getter('template_props');
    }
    set template_props(v) {
      this._setter('template_props', v);
    }

    value_change(field, type, value) {
      if(field == 'calc_order' && this[field] != value) {
        this[field] = value;
        const {calc_order} = this;
        calc_order.load_templates();
        if(this.base_block.calc_order !== calc_order) {
          this.base_block = '';
        }
      }
    }

  }

  templates._select_template = new FakeSelectTemplate();
}

