
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tip from 'wb-forms/dist/Common/Tip';
import {useStyles} from '../../Toolbar'

function ProfileToolbar({editor, current, classes}) {
  const {msg} = $p;
  return <Toolbar disableGutters variant="dense">
    Профиль
  </Toolbar>;
}

export default useStyles(ProfileToolbar);
