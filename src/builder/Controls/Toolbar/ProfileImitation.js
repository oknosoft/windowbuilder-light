import React from 'react';
import IconButton from '@mui/material/IconButton';
import MuiCompressIcon from '@mui/icons-material/Compress';
import {styled} from '@mui/material/styles';
import {HtmlTooltip} from '../../../aggregate/App/styled';

const CompressIcon = styled(MuiCompressIcon)(({ theme }) => (
  {transform: 'rotate(90deg)'}
));

export default function ButtonImitation({elm, layer}) {
  const {children, parent, bind} = layer.three;
  if(parent || children.length) {
    const bySide = layer.profilesBySide();
    const fin = () => {
      elm.project.props.registerChange();
      elm.project.redraw();
    };
    let action, title = 'Сделать элемент ';
    if(parent && bySide[bind.invert().valueOf()] === elm) {
      if(elm.imitationOf) {
        title += 'самостоятельным';
        action = () => {
          elm.raw('imitationOf', null);
          fin();
        };
      }
      else {
        title += 'общим';
        action = () => {
          elm.raw('imitationOf', parent.profilesBySide()[bind.valueOf()]);
          fin();
        };
      }

    }
    else {
      for(const child of children) {

      }
    }
    if(action) {
      return <HtmlTooltip title={title}>
        <IconButton onClick={action}><CompressIcon /></IconButton>
      </HtmlTooltip>;
    }
  }
  return null;
}
