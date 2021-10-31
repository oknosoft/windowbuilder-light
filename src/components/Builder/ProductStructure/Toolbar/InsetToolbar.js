
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import {useStyles} from '../../Toolbar';

function InsetToolbar({editor, current, classes}) {
  const {msg} = $p;
  return <Toolbar disableGutters variant="dense">
    Пара элементов
  </Toolbar>;
}

export default useStyles(InsetToolbar);
