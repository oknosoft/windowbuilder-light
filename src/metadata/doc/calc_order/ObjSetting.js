import * as React from 'react';
import Dialog from 'metadata-ui/App/Dialog';

import FunctionsIcon from '@mui/icons-material/Functions';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import WindowIcon from '@mui/icons-material/Window';
import CalculateIcon from '@mui/icons-material/Calculate';
import GradingIcon from '@mui/icons-material/Grading';

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
    {name: 'builder', text: 'Построитель', visible: false},
    {name: 'parametric', text: 'Параметрик', visible: false},
    {name: 'nom', text: 'Материалы, услуги', visible: true},
    {name: 'all', text: 'Все строки', visible: true},
  ];
}
setting.iconMap = {
  all: <FunctionsIcon />,
  builder: <FormatShapesIcon />,
  glass: <WindowIcon />,
  nom: <GradingIcon />,
  parametric: <CalculateIcon />,
};

export function ObjSetting({setSettingOpen}) {
  return <Dialog open onClose={() => setSettingOpen(false)} />;
}
