import * as React from 'react';
import Dialog from 'metadata-ui/App/Dialog';

const schemas = {
  set: '',
};

export const key = 'doc.inventory_cuts.form.obj';
export const setting = $p.wsql.get_user_param(key, 'object') || {};
if(!Object.keys(setting).length) {
  setting.head = [
    {text: 'Номер, Дата', visible: true},
    {text: 'Участок, Комментарий', visible: true}
  ];
  setting.tabs = [];
}

export function ObjSetting({setSettingOpen}) {
  return <Dialog open onClose={() => setSettingOpen(false)} />;
}
