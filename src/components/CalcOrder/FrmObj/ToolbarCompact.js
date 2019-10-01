import React from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/ShoppingCart';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';

import {path} from '../../App/menu_items';
import withStyles from './styles';

function ToolbarCompact({_obj, handlers, classes}) {
  const {obj_delivery_state, ref} = _obj;
  return <div>
    {obj_delivery_state == 'Черновик' &&
    <Button
      key="add"
      variant="contained"
      size="small"
      color="secondary"
      aria-label="Add"
      classes={{root: classes.margin, label: classes.padding}}
      onClick={() => {
        handlers.handleNavigate(path(`cat.templates/list?order=${ref}&ref=new`));
      }}
      title="Выбрать новое изделие из каталога"
    >
      <AddIcon className={classes.extendedIcon} />
      Добавить изделие
    </Button>
    }
    {
      obj_delivery_state == 'Черновик' &&
      <Button
        key="send"
        variant="contained"
        size="small"
        color="primary"
        aria-label="Confirm"
        classes={{root: classes.margin, label: classes.padding}}
        onClick={() => {
          ;
        }}
        title="Оплатить и оформить заказ"
      >
        <SendIcon className={classes.extendedIcon} />
        Оформить
      </Button>
    }
  </div>;
};

export default withStyles(ToolbarCompact);
