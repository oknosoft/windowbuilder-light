/**
 * Выбор области применения шаблона
 *
 * @module FrmList
 *
 * Created by Evgeniy Malyarov on 30.09.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Wrapper from '../App/Wrapper';
import CloseBtn from '../CalcOrder/FrmObj/CloseBtn';
import {path, prm} from '../App/menu_items';
import TemplateRow from './TemplateRow';

const title = 'Выбор области применения окна';

export default function CalcOrderList({_mgr, handlers}) {
  const data = [];
  _mgr.forEach((obj) => {
    if(!obj.empty() && !obj.is_new()) {
      data.push(obj);
    }
  });

  function handleClose() {
    const {order} = prm();
    handlers.handleNavigate(path(`doc.calc_order/${order ? order : 'list'}`));
  }

  return <Wrapper title={title} handlers={handlers} CustomBtn={<CloseBtn handleClose={handleClose}/>}>
    {
      data.map((row, index) => <TemplateRow key={`r-${index}`} row={row} handlers={handlers}/>)
    }
  </Wrapper>;
}

CalcOrderList.propTypes = {
  _mgr: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
};
