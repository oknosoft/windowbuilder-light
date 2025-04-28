import React from 'react';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {ListSubheader} from '../../../../metadata/aggregate/styled';
import {Toolbar, HtmlTooltip} from '../../../../components/App/styled';
import Autocomplete from 'metadata-ui/DataField/Autocomplete';


export default function ManualToolbar({title, setExt, cuts, currentCut, setCut}) {

  const optionsCuts= Array.from(cuts.keys());

  return <ListSubheader>
    <Toolbar disableGutters>
      <Typography>{title}</Typography>
      <Divider orientation="vertical" flexItem sx={{m: 1}} />
      <Autocomplete
        options={optionsCuts}
        onChange={(e, v) => setCut(v)}
        value={currentCut}
        label="Заготовка"
        title="Лист, для размещения изделия"
        getOptionLabel={(v) => `${v.len}x${v.width}`}
        sx={{pt: 1}}
      />

      <Typography sx={{flex: 1}}></Typography>
      <HtmlTooltip title="Закрыть ручной раскрой">
        <IconButton onClick={() => setExt(null)}><CloseIcon/></IconButton>
      </HtmlTooltip>
    </Toolbar>
  </ListSubheader>;
}
