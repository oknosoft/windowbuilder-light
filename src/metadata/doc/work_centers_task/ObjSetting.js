import * as React from 'react';
import Dialog from '../../../packages/ui/App/Dialog';

const schemas = {
  planning: 'c864d895-ac50-42be-8760-203cc46d208f',
  demand: 'dab2c503-a426-4bf5-f083-fe6f1c64fbe5',
  cuts_in: '187f9a40-94fc-4ad2-ee4c-26341b816ade',
  cutting: '4fe15a0f-a6c2-442e-d8bb-7204c3085c4e',
  cuts_out: '8fca797a-4e1c-4f8b-b0aa-1965b5e5e7db',
};

export const key = 'doc.work_centers_task.form.obj';
export const setting = $p.wsql.get_user_param(key, 'object') || {};
if(!Object.keys(setting).length) {
  setting.head = [
    {text: 'Номер, Дата', visible: true},
    {text: 'Контрагент, Адрес', visible: true},
    {text: 'Комментарий, Сумма', visible: true}
  ];
  setting.tabs = [
    {name: 'cuts_in', text: 'Заготовки', visible: true},
    {name: 'cutting', text: 'Раскрой', visible: true},
    {name: 'cuts_out', text: 'Обрезь', visible: true},
    {name: 'demand', text: 'Потребность', visible: false},
    {name: 'planning', text: 'Планирование', visible: true},
  ];
}

export function ObjSetting({setSettingOpen}) {
  return <Dialog open onClose={() => setSettingOpen(false)} />;
}
