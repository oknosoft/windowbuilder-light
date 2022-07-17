
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tip from 'metadata-react/App/Tip';
import {useStyles} from '../../Toolbar/styles'

function OrderToolbar({editor, elm, order, set_order, classes}) {
  const {msg} = $p;

  const handleChange = (event, newOrder) => {
    set_order(newOrder);
  };

  return <Toolbar disableGutters variant="dense">
    <ToggleButtonGroup size="small" value={order} exclusive onChange={handleChange}>
      <ToggleButton value="prod" classes={{root: classes.toggleBtn}}>
        <Tip title="Все изделия заказа">
          <i className="fa fa-object-ungroup fa-fw"/>
        </Tip>
      </ToggleButton>
      <ToggleButton value="prm" classes={{root: classes.toggleBtn}}>
        <Tip title="Изделия параметрика">
          <i className="fa fa-gavel fa-fw"/>
        </Tip>
      </ToggleButton>
      <ToggleButton value="nom" classes={{root: classes.toggleBtn}}>
        <Tip title="Материалы и услуги">
          <i className="fa fa-cube fa-fw"/>
        </Tip>
      </ToggleButton>
    </ToggleButtonGroup>
    <div className={classes.title} />
  </Toolbar>;
}

export default useStyles(OrderToolbar);
