import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {HtmlTooltip} from '../../../aggregate/App/styled';
import AddLayer from './AddLayer';

export default function FillingToolbar(props) {
  const {editor, project, layer, elm, setContext} = props;
  const remove = () => {
    if(elm) {
      const {container} = elm;
      elm.remove();
      container?.createChild({kind: 'blank'});
      project?.redraw();
    }
  }

  return <>
    <AddLayer {...props} />
    <Box sx={{flex: 1}} />
    <HtmlTooltip title="Удалить элемент">
      <IconButton disabled={!(elm instanceof editor.Filling)} onClick={remove}><i className="fa fa-trash-o" /></IconButton>
    </HtmlTooltip>
  </>
}
