import React from 'react';

const stub = {presentation: ''};
export default function proto_columns({utils: {moment}, enm, md}) {

  const typed_formatters = {};

  const indicator_formatter = (is_doc, is_date) => function IndicatorFormatter({value, row, raw}) {
    if(value && value.toString) {
      value = value.toString();
    }
    if(raw) {
      return value;
    }
    let indicator = 'cell_ref_elm';
    if(row.deleted) {
      indicator = is_doc ? 'cell_doc_deleted' : 'cell_ref_elm_deleted';
    }
    else if(row._open) {
      indicator = 'cell_ref_folder_open';
    }
    else if(row.is_folder) {
      indicator = 'cell_ref_folder';
    }
    else if(is_doc) {
      indicator = row.posted ? 'cell_doc_posted' : 'cell_doc';
    }
    if(is_date) {
      const values = value.split(' ');
      if(values.length === 2) {
        return <div className={indicator} title={value}>{values[0]}<small>{` ${values[1]}`}</small></div>;
      }
    }
    return <div className={indicator} title={value}>{value}</div>;
  };

  const date_formatter = (format, indicator, is_doc) => {
    const formatter = indicator && indicator_formatter(is_doc, true);
    return function DateFormatter({value, row, raw}) {
      if(!value || value.length < 5) {
        value = String(value || '');
      }
      else {
        value = moment(value).format(moment._masks[format]);
      }
      if(raw) {
        return value;
      }
      if(formatter) {
        return formatter({value, row});
      }
      const values = value.split(' ');
      if(values.length === 2) {
        return <div className={indicator} title={value}>{values[0]}<small>{` ${values[1]}`}</small></div>;
      }
      return <div title={value}>{value}</div>;
    };
  };

  function PresentationFormatter ({value, raw}) {
    let text = typeof value === 'string' ? value : (value && value.presentation) || '';
    if(text === '_') {
      text = '';
    }
    return raw ? text : <div title={text}>{text}</div>;
  }

  const typed_formatter = (type) => {
    if(typed_formatters[type]) {
      return typed_formatters[type];
    }
    const _mgr = md.mgr_by_class_name(type);
    if(_mgr) {
      typed_formatters[type] = (row) => {
        return PresentationFormatter({
          value: _mgr.get(row.value, true) || stub,
          raw: row.raw,
        });
      };
      return typed_formatters[type];
    }
  };

  const number_formatter = (fraction = 0) => {
    return function NumberFormatter ({value, raw}) {
      if(!value && value !== 0) value = 0;
      const tmp = typeof value === 'number' ? value : parseFloat(value);
      const text = isNaN(tmp) ? value.toString() : tmp.toFixed(fraction);
      return raw ? (tmp || 0) : <div title={text} style={{textAlign: 'right'}}>{text}</div>;
    };
  };

  function BoolFormatter ({value, raw}) {
    const v = value ? 'Да' : 'Нет';
    return raw ? v : <div>{v}</div>;
  }

  function PropsFormatter ({value, raw}) {
    return raw ? value.presentation : <div title={value.toString()}>{value.presentation}</div>;
  }

  const appearance_formatter = (appearance, formatter) => {
    return function AppearanceFormatter (props) {
      //const {row, raw, value, isScrolling, dependentValues} = props;
      for(const crow of appearance) {
        if(crow.check(props.row)) {
          try {
            const {withRaw, text, fraction, ...css} = JSON.parse(crow.css);
            let value;
            if(typeof text === 'string' && (withRaw || !props.raw)) {
              value = text;
            }
            else if(typeof fraction === 'number') {
              value = number_formatter(fraction)({
                value: formatter(Object.assign({}, props, {raw: true})),
                raw: props.raw,
              });
            }
            else {
              value = formatter(props);
            }
            return props.raw ? value : <div style={css}>{value}</div>;

          }
          catch (e) {}
        }
      }
      return formatter(props);
    };
  };

  return function rx_columns({mode, fields, _obj, _mgr, read_only}) {

    const res = this.columns(mode);
    const {input, text, label, link, cascader, toggle, image, type, path, props, typed_field} = enm.data_field_kinds;
    if(!_mgr && _obj) {
      _mgr = _obj._manager;
    }
    const is_doc = _mgr.class_name.startsWith('doc.');
    const is_rep = _mgr.class_name.startsWith('rep.');
    const editable = (_obj && !read_only) ? !is_rep || this.obj.indexOf(`.${_mgr._tabular || 'data'}`) === -1 : false;

    const appearance = {};
    this.conditional_appearance.find_rows({use: true, columns: {nin: ['','*']}}, (crow) => {
      for(const fld of crow.columns.split(',')) {
        if(!appearance[fld]) {
          appearance[fld] = [];
        }
        appearance[fld].push(crow);
      }
    });

    if(fields) {
      res.forEach((column, index) => {

        const keys = column.key.split('.');
        let _fld = column._meta = fields[keys[0]];
        for(let i = 1; i < keys.length; i++) {
          const pmeta = md.get(_fld.type.types[0]);
          if(pmeta) {
            _fld = column._meta = pmeta.fields[keys[i]];
          }
        }
        if(!_fld && _mgr) {
          _fld = column._meta = _mgr.metadata(keys[0]);
        }


        if(!column.formatter && _fld && _fld.type) {

          if(column.key === 'ref' || _fld.type.is_ref) {
            column.formatter = !_obj && _fld.type.types[0].includes('.') ? typed_formatter(_fld.type.types[0]) : PresentationFormatter;
          }
          else if(_fld.type.date_part) {
            column.formatter = date_formatter(_fld.type.date_part, !index && !editable, is_doc);
          }
          else if(_fld.type.digits && _fld.type.types.length === 1){
            column.formatter = number_formatter(_fld.type.fraction);
          }
          else if(_fld.type.types.includes('boolean')) {
            column.formatter = BoolFormatter;
          }
        }

        switch (column.ctrl_type) {

          case label:
            break;

          case input:
          case text:
          case link:
          case cascader:
            column.editable = editable;
            break;

          case toggle:
            const toggle_options = [
              {
                id: 0,
                value: false,
                text: 'Нет',
                title: 'Нет',
              },
              {
                id: 1,
                value: true,
                text: 'Да',
                title: 'Да',
              }
            ];
            if(editable){
              //column.editor = <DropDownEditor options={toggle_options}/>;
            }
            //column.formatter = <DropDownFormatter options={toggle_options} value={''}/>;
            break;

          case path:
            if(editable){
              //column.editor = PathFieldCell;
            }
            break;

          case type:
            if(editable){
              //column.editor = TypeFieldCell;
            }
            break;

          case props:
            if(editable){
              //column.editor = PropsFieldCell;
            }
            column.formatter = PropsFormatter;
            break;

          case typed_field:
            if(editable){
              //column.editor = DataCellTyped;
            }
            column.formatter = PresentationFormatter;
            break;

          default:
            if(!column.editor && editable){
              //column.editor = DataCell;
            }
            else if(!column.formatter && !index && !is_rep) {
              column.formatter = indicator_formatter(is_doc);
            }
        }

        if(appearance[column.key] && column.formatter) {
          column.formatter = appearance_formatter(appearance[column.key], column.formatter);
        }

      });
    }

    return res;
  };
}