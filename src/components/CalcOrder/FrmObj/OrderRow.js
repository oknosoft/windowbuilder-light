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
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import {path} from '../../App/menu_items';
import withStyles from './styles';


function OrderRow({row, classes, handlers}) {
  const {_owner, nom, characteristic: ox} = row;
  const {scale_svg} = $p.utils;
  return (
    <ListItem className={classes.hovered}>
      <Grid container spacing={3} className={classes.left}>
        <Grid item xs={4} sm={3}>
          <div ref={(el) => {
            if(el){
              el.innerHTML = ox.svg ? scale_svg(ox.svg, {width: 120, height: 120, zoom: 0.2}, 0) : "нет эскиза";
            }
          }}/>
        </Grid>
        <Grid item xs={8} sm={9}>
          <Grid container direction="column" justify="space-between" className={classes.height}>
            <Grid item>
              <Typography variant="h6">{nom.name}</Typography>
              <Typography variant="subtitle1">{`Ширина: ${ox.x}, Высота: ${ox.y}`}</Typography>
            </Grid>
            {(!_owner.obj_delivery_state || _owner.obj_delivery_state == 'Черновик') && <Grid item>
              <Button
                variant="contained"
                size="small"
                color="primary"
                aria-label="Edit"
                classes={{root: classes.margin, label: classes.padding}}
                onClick={() => {
                  handlers.handleNavigate(path(`builder/${ox.ref}`));
                }}
                title="Задать размеры изделия"
              >
                <EditIcon className={classes.extendedIcon} />
                Изменить
              </Button>
              <Button
                variant="contained"
                size="small"
                aria-label="Delete"
                classes={{root: classes.margin, label: classes.padding}}
                onClick={() => handlers.dialogs
                  .confirm({title: 'Удалить изделие?', text: `Подтвердите удаление изделия "${name}"`})
                  .then(() => row._owner.delRow(row))
                  .catch(() => null)
                  }
                title="Удалить изделие из заказа"
              >
                <DeleteIcon className={classes.extendedIcon} />
                Удалить
              </Button>
            </Grid>}
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
};

export default withStyles(OrderRow);
