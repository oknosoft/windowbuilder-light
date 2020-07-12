/**
 * Добавляет-отключает пункты меню в зваисимости от ролей пользователя
 *
 * @module tune_menu
 *
 * Created by Evgeniy Malyarov on 27.05.2020.
 */

import menu_items, {path} from './menu_items';

const role_items = {
  ИзменениеТехнологическойНСИ: {
    catalogs: [

    ]
  },
  ОбеспечениеПотребностей: {
    docs: [
      {
        text: 'Заказ поставщику',
        id: 'doc_purchase_order',
        navigate: path('doc.purchase_order/list'),
        need_meta: true,
        need_user: true,
      },
    ]
  },
  РедактированиеОплат: {

  },
  РедактированиеОтгрузок: {

  },
  РедактированиеЦен: {

  },
  РедактированиеДиспетчеризации: {

  }
}

function add_item(group, items) {
  const root = menu_items.find((grp) => grp.id === group);
  items.forEach((item) => root.items.push(item));
}

export function user_log_in() {
  const {current_user} = $p;
  for(const role in role_items) {
    if(current_user.role_available(role)) {
      for(const group in role_items[role]) {
        add_item(group, role_items[role][group]);
      }
    }
  }
}

export function user_log_out() {
  for(const item of menu_items) {
    if(item.id === 'docs') {
      item.items.length = 1;
    }
    else if(item.id === 'catalogs') {
      item.items.length = 0;
    }
  }

}
