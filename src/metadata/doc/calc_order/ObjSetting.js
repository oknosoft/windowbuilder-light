import * as React from 'react';
import Dialog from '../../../packages/ui/App/Dialog';

export const key = 'doc.calc_order.form.obj';
export const setting = $p.wsql.get_user_param(key, 'object') || {};
if(!Object.keys(setting).length) {
  setting.head = [
    {text: 'Номер, Дата', visible: true},
    {text: 'Контрагент, Адрес', visible: true},
    {text: 'Комментарий, Сумма', visible: true}
  ];
  setting.tabs = [
    {name: 'glass', text: 'Заполнения', visible: true},
    {name: 'all', text: 'Все строки', visible: true},
    {name: 'builder', text: 'Построитель', visible: false},
    {name: 'parametric', text: 'Параметрик', visible: false},
  ];
}

export function ObjSetting({setSettingOpen}) {
  return <Dialog open onClose={() => setSettingOpen(false)} />;
}
