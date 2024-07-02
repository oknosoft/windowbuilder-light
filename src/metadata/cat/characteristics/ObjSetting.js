import * as React from 'react';

import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import TocIcon from '@mui/icons-material/Toc';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import MoreOutlinedIcon from '@mui/icons-material/MoreOutlined';

export const key = 'cat.characteristics.form.obj';
export const setting = $p.wsql.get_user_param(key, 'object') || {};
if(!Object.keys(setting).length) {
  setting.tabs = [
    {name: 'head', text: 'Реквизиты', visible: true},
    {name: 'specification', text: 'Спецификация', visible: true},
    {name: 'constructions', text: 'Конструкции', visible: true},
    {name: 'coordinates', text: 'Координаты', visible: true},
    {name: 'params', text: 'Параметры', visible: true},
  ];
  setting.tab = 1;
}
setting.iconMap = {
  head: <DomainVerificationIcon />,
  specification: <TocIcon />,
  constructions: <AccountTreeOutlinedIcon />,
  coordinates: <DynamicFeedIcon />,
  params: <MoreOutlinedIcon />,
};

