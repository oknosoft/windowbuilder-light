/**
 * ### Форма добавления услуг и комплектуюущих
 * обработчики событий и модификаторы данных
 *
 * Created by Evgeniy Malyarov on 13.11.2017.
 */

import AdditionsItem from './AdditionsItem';
const {ItemData} = $p.cat.inserts;


// заполняет компонент данными
export function fill_data(_obj, items) {

  if(!items) {
    items = this.items = $p.enm.inserts_types.additions_groups;
  }
  const dp = this.dp = $p.dp.buyers_order.create();
  dp.calc_order = _obj;
  const components = this.components = new Map();
  items.forEach(v => components.set(v, new ItemData(v, AdditionsItem)));

  const {production, product_params} = dp;

  // фильтруем по пустой ведущей продукции
  dp._data._loading = true;
  dp.calc_order.production.find_rows({ordn: $p.utils.blank.guid}, (row) => {
    const {characteristic} = row;
    const {origin} = characteristic;
    // фильтруем по типу вставки
    if(!characteristic.empty() && origin && !origin.empty() && items.indexOf(origin.insert_type) != -1) {
      const cmp = components.get(origin.insert_type);
      // добавляем параметры
      const elm = production.count() + 1;
      characteristic.params.forEach(({param, value}) => {
        product_params.add({elm, param, value});
      });
      // добавляем строку продукции
      production.add({
        characteristic,
        inset: origin,
        clr: characteristic.clr,
        len: row.len,
        height: row.width,
        quantity: row.quantity,
        note: row.note,
      }, false, cmp.ProductionRow);
      // счетчик строк данного типа
      cmp.count++;
    }
  });
  dp._data._loading = false;
}

// заполняет соответствие схем и типов вставок в state компонента
export function fill_schemas(docs = []) {
  if(!docs.length) {
    docs = $p.cat.scheme_settings.find_rows({obj: 'dp.buyers_order.production', user: ''});
  }
  const schemas = new Map();
  for (const doc of docs) {
    for (const item of this.items) {
      if(item && doc.name == item.name) {
        schemas.set(item, doc);
        break;
      }
    }
  }
  this.setState({schemas});
}

export function handleAdd() {
  const {tabular, props} = this;
  const inset = find_inset.call(this, props.group);
  if(inset && tabular) {
    const {_data} = tabular.state._tabular._owner;
    _data._loading = true;
    const row = tabular.state._tabular.add({inset, quantity: 1}, false, props.ProductionRow);
    _data._loading = false;
    row.value_change('inset', 'force', row.inset);
    this.setState({
      count: this.state.count + 1,
    });

    //selectRow
    if(inset.insert_type == $p.enm.inserts_types.Параметрик) {
      for(let i = 0; i < row.row; i++) {
        if(tabular.rowGetter(i) === row) {
          setTimeout(() => tabular._grid.selectCell({rowIdx: i, idx: 0}, true));
          break;
        }
      }
    }
  }
  else {
    $p.ui.dialogs.alert({text: `Нет вставки подходящего типа (${props.group})`, title: 'Новая строка'});
  }
}

export function handleRemove() {
  const {props, tabular, state, selectedRow} = this;
  if(tabular && selectedRow) {
    const {calc_order_row} = selectedRow.characteristic;
    selectedRow._owner.del(selectedRow);
    this.selectedRow = null;
    tabular.forceUpdate();
    if(state.count) {
      this.setState({
        count: state.count - 1,
      });
    }
    if(calc_order_row) {
      calc_order_row._owner.del(calc_order_row);
    }
    props.onSelect && props.onSelect(null);
  }
  else {
    $p.ui.dialogs.alert({text: `Укажите строку для удаления (${props.group})`, title: 'Удаление строки'});
  }
}


// ищет первую, наиболее приоритетную вставку данного типа
export function find_inset(insert_type) {
  if(!this._inset) {
    const {choice_params} = $p.dp.buyers_order.metadata('production').fields.inset;
    const filter = {insert_type};
    choice_params && choice_params.forEach(({name, path}) => {
      if(name === 'insert_type') {
        return;
      }
      if(Object.prototype.hasOwnProperty.call(filter, name)) {
        filter[name] = [filter[name]];
        filter[name].push(path);
      }
      else {
        filter[name] = path;
      }
    });
    this._inset = $p.cat.inserts.find_rows(filter)
      .reduce((curr, next) => curr && curr.priority >= next.priority ? curr : next, null);
  }
  return this._inset;
}

function mapStateToProps(/*state, props*/) {
  return {
    handleCalck() {
      const {additions} = this;
      return additions.dp ? additions.dp.calc_order.process_add_product_list(additions.dp) : additions.handleCalck()
        .then(() => {
          //dp.calc_order.production.sync_grid(props.dialog.wnd.elmnts.grids.production);
        });
    },
  };
}

// function mapDispatchToProps(dispatch) {
//   return {};
// }
