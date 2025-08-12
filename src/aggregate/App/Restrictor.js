import React from 'react';
import {Navigate} from 'react-router';
import {item_props} from './menu';

export const Restrictor = ({children}) => {
  const iprops = item_props();
  const restricted = iprops?.restrict &&
    (typeof $p === 'object') &&
    !$p.current_user?.role_available('СогласованиеРасчетовЗаказов');
  return restricted ? <Navigate to="/doc/calc_order" /> : children;
};
