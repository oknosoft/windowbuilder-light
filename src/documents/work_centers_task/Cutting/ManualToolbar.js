import React from 'react';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import {ListSubheader} from '../../../aggregate/Toolbars/styled';
import {Toolbar, HtmlTooltip} from '../../../aggregate/App/styled';
import Autocomplete from 'metadata-ui/DataField/Autocomplete';

function productLabel(v) {
  let title = v.rotated ? `${v.width}x${v.len}` : `${v.len}x${v.width}`;
  if(v.stick) {
    title += ` (${v.stick})`;
  }
  return title;
}

export default function ManualToolbar({title, setExt, cuts, currentCut, setCut, products, currentProduct, setProduct, setRefresh}) {

  const rotated = currentProduct?.rotated;
  const rotateTitle = currentProduct ? (rotated ? 'Повёрнуто' : 'Не повёрнуто') : 'Поворот изделия';
  const rotate = () => {
    currentProduct.rotated = !rotated;
    setRefresh();
  };

  return <ListSubheader>
    <Toolbar disableGutters>
      <Typography>{title}</Typography>
      <Divider orientation="vertical" flexItem sx={{m: 1}} />
      <Autocomplete
        options={Array.from(cuts.keys())}
        onChange={(e, v) => setCut(v)}
        value={currentCut}
        label="Заготовка"
        title="Лист, для размещения изделия"
        getOptionLabel={(v) => `${v.len}x${v.width}`}
        sx={{pt: 1}}
      />
      <Autocomplete
        options={products}
        onChange={(e, v) => setProduct(v)}
        value={currentProduct}
        label="Изделие"
        title="Изделие, для размещения на листе"
        getOptionLabel={productLabel}
        sx={{pt: 1}}
      />
      <HtmlTooltip title={rotateTitle}>
        <IconButton disabled={!currentProduct} onClick={rotate}>
          {rotated ? <Rotate90DegreesCwIcon/> : <Rotate90DegreesCcwIcon/>}
        </IconButton>
      </HtmlTooltip>

      <Typography sx={{flex: 1}}></Typography>
      <HtmlTooltip title="Закрыть ручной раскрой">
        <IconButton onClick={() => setExt(null)}><CloseIcon/></IconButton>
      </HtmlTooltip>
    </Toolbar>
  </ListSubheader>;
}
