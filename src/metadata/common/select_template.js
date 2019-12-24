/**
 *
 *
 * @module select_template
 *
 * Created by Evgeniy Malyarov on 24.12.2019.
 */

export default function ({classes, cat: {characteristics, templates}, utils}) {

  class FakeSelectTemplate extends classes.BaseDataObj {

    constructor() {
      //calc_order, sys, template_props
      super({}, characteristics, false, true);
      this._data._is_new = false;
      this._meta = utils._clone(characteristics.metadata());
      this._meta.fields.template_props = templates.metadata('template_props');
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

  }

  templates._select_template = new FakeSelectTemplate();
}

