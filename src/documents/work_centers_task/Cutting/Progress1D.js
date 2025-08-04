import React from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import {styled} from '@mui/material/styles';

const FragmentNom = styled('div')(({ theme }) => ({marginBottom: theme.spacing(2)}));
const TextNoPadding = styled(ListItemText)(() => ({padding: 0}));

export function stat(status) {
  const {rows, workpieces, products_len, workpieces_len, scraps_percent, scraps_len, userData: {usefulscrap}} = status;
  return `${(products_len / 1000).toFixed(1)}м, ${rows.length}шт, Заготовок: ${
    (workpieces_len / 1000).toFixed(1)}м, ${workpieces.length}шт, Обрезь: ${
    (scraps_len / 1000).toFixed(1)}м, ${workpieces.reduce((sum, val) => val > usefulscrap ? sum + 1 : sum, 0)}шт, Отходы: ${
    ((workpieces_len - products_len - scraps_len) / 1000).toFixed(1)}м, ${scraps_percent.toFixed(1)}%`;
}

function ProgressStick({status}) {
  const completed = status.progress * 100;
  const buffer = completed + Math.random() * 6;
  let primary = `${status.nom.name}${status.characteristic.empty() ? '' : ' ' + status.characteristic.name}`;
  if(status.parts > 1) {
    primary += ` (${status.part + 1} из ${status.parts})`;
  }

  return <FragmentNom>
    <ListItemText primary={primary}/>
    <LinearProgress color="secondary" variant="buffer" value={completed} valueBuffer={buffer}/>
    <TextNoPadding secondary={stat(status)} />
  </FragmentNom>;
}

export default function CuttingProgress1D({statuses}) {
  return <List>
    {statuses.map((status, index) => <ProgressStick key={`p-${index}`} status={status}/>)}
  </List>;
}


