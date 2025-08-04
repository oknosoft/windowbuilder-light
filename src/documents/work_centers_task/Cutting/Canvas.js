import React from 'react';
import {styled} from '@mui/material/styles';
import {ManualCutter} from './ManualCutter';


export const StyledCanvas = styled('canvas')(({ theme }) => ({
  padding: 4,
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.grey[50],
}));

function createEditor() {

}

export default function Canvas({cuts, currentProduct, setProduct, currentCut, setCut, rotated}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const editor = new ManualCutter({ref, cuts, currentProduct, currentCut});
    return editor.unload();
  }, []);
  React.useEffect(() => {
    ref.project.activeLayer.children.sheet.setup({cuts, currentProduct, currentCut});
  }, [currentProduct, currentCut, rotated]);
  return <StyledCanvas ref={ref} />;
}
