import React from 'react';
import IconChart from '@material-ui/icons/InsertChart';
import IconDoc from '@material-ui/icons/EventNote';
import IconList from '@material-ui/icons/List';
import qs from 'qs';

import IconInfo from '@material-ui/icons/Info';
import IconSettings from '@material-ui/icons/Settings';
//import IconHelp from '@material-ui/icons/Help';
//import IconPerson from '@material-ui/icons/Person';
//import IconDrafts from '@material-ui/icons/Drafts';

//import IconBusinessCenter from '@material-ui/icons/BusinessCenter';

export const stitle = 'Заказ дилера';
export const description = 'Расчет изделий и подготовка производства';

//export const base = process.env.NODE_ENV === 'production' ? '/light' : '';
export const base = '';

export function path(url) {
  return `${base}/${url}`;
}

export function prm() {
  return qs.parse(location.search.replace('?',''));
}

const items = [
  {
    text: 'Документы',
    icon: <IconDoc/>,
    open: true,
    id: 'docs',
    items: [
      {
        text: 'Расчет-заказ',
        id: 'doc_calc_order',
        navigate: path('doc.calc_order/list'),
        need_meta: true,
        need_user: true,
        //icon: <IconBusinessCenter/>,
      },
    ]
  },
  {
    text: 'Справочники',
    icon: <IconList/>,
    open: true,
    id: 'catalogs',
    items: []
  },
  {
    text: 'Отчеты',
    icon: <IconChart/>,
    open: true,
    id: 'reports',
    items: [
      {
        text: 'Исполнение заказов',
        id: 'rep_cash_moving',
        navigate: path('rep.cash_moving/main'),
        need_meta: true,
        need_user: true,
        //icon: <IconList/>,
      }
    ]
  },
  {
    divider: true,
  },
  {
    text: 'Настройки',
    navigate: path('settings'),
    need_meta: true,
    icon: <IconSettings/>,
  },
  // {
  //   text: 'Справка',
  //   navigate: path('help'),
  //   icon: <IconHelp/>
  // },
  {
    text: 'О программе',
    navigate: path('about'),
    icon: <IconInfo/>
  }
];

function path_ok(path, item) {
  const pos = item.navigate && item.navigate.indexOf(path);
  return pos === 0 || pos === 1;
}

function with_recursion(curr, parent) {
  if(curr && curr != path('')){
    for(const item of parent){
      const props = item.items ? with_recursion(curr, item.items) : path_ok(curr, item) && item;
      if(props){
        return props;
      }
    }
  }
}

export function item_props(path) {
  if(!path){
    path = location.pathname;
  }
  if(path.endsWith('/')) {
    path = path.substr(0, path.length - 1);
  }
  // здесь можно переопределить нужность meta и авторизованности для корневой страницы
  let res = with_recursion(path, items);
  if(!res && path.indexOf('/') !== -1) {
    res = with_recursion(path.substr(0, path.lastIndexOf('/')), items);
  }
  if(!res && (path.match(/\/(doc|cat|ireg|cch|rep)\./) || path.match(/\/builder/) || path.match(/\/templates/))){
    res = {need_meta: true, need_user: true};
  }
  return res || {};
}

export default items;
