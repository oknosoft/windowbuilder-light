/**
 * Строка заказа с указанием шаблона или номенклатуры, цвета, размеров, количества и цены
 *
 * @module OrderRow
 *
 * Created by Evgeniy Malyarov on 17.01.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/List';
import Button from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tip from '../../Builder/Tip';
import Quantity from './Quantity';
import Amount from './Amount';

import {path} from '../../App/menu_items';
import withStyles from './styles';


function OrderRow({row, classes, handlers, is_technologist}) {
  const {_owner, nom, characteristic: ox} = row;
  const {obj_delivery_state, sending_stage} = _owner._owner;
  const {utils: {scale_svg}, ui: {dialogs}} = $p;
  const editable = is_technologist || ((obj_delivery_state == 'Черновик' || obj_delivery_state == 'Отозван') && sending_stage.empty());

  function edit() {
    if(editable) {
      handlers.handleNavigate(path(`builder/${ox.ref}`));
    }
    else {
      dialogs.alert({text: `Нельзя редактировать изделия, когда заказ в статусе '${sending_stage}'`, title: 'Статус отправки'});
    }
  }

  return (
    <ListItem className={classes.hovered} onDoubleClick={edit} >
      <Grid container className={classes.left}>
        <Grid item xs={4} sm={3}>
          <div ref={(el) => {
            if(el){
              el.innerHTML = ox.svg ? scale_svg(ox.svg, {width: 100, height: 100, zoom: 0.2}, 0) : "нет эскиза";
            }
          }}/>
        </Grid>
        <Grid item xs={4} sm={3}>
          <Grid container direction="column" justify="space-between" className={classes.height}>
            <Grid item>
              <Typography variant="h6">{nom.name}</Typography>
              <Typography variant="body2">{`Ширина: ${ox.x}, Высота: ${ox.y}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} sm={6}>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Quantity row={row}/>
            </Grid>
            <Grid item>
              <Amount row={row}/>
            </Grid>
            <Grid item>
              <Tip title="Изменить размеры и форму изделия">
                <Button
                  color="primary"
                  disabled={!editable}
                  onClick={edit}
                >
                  <EditIcon />
                </Button>
              </Tip>
              <Tip title="Удалить изделие из заказа">
                <Button
                  variant="contained"
                  disabled={!editable}
                  onClick={() => dialogs
                    .confirm({title: 'Удалить изделие?', text: `Подтвердите удаление изделия ${ox.prod_name(true)}`})
                    .then(() => _owner.del(row))
                    .catch(console.log)
                  }
                >
                  <DeleteIcon />
                </Button>
              </Tip>

            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ListItem>
  );
}

OrderRow.propTypes = {
  row: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  is_technologist: PropTypes.bool,
};

export default withStyles(OrderRow);
