import React from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

function calcStat(obj) {
  const res = {
    debit: {count: 0, area: 0},
    credit: {count: 0, area: 0},
    product: {count: 0, area: 0},
  };
  for(const row of obj.cuts) {
    const mark = row.record_kind.is('debit') ? res.debit : res.credit;
    mark.count += 1;
    mark.area += row.len * row.width / 1e6;
  }
  for(const row of obj.cutting) {
    res.product.count += 1;
    res.product.area += row.len * row.width / 1e6;
  }
  res.useArea = res.debit.area - res.credit.area;
  return res;
}

export default function CuttingReport2D({obj}) {
  const stat = calcStat(obj);
  return <>
    <Typography sx={{ml:1}} variant="h5">Статистика 2D</Typography>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Всего изделий:</TableCell>
          <TableCell>{`${stat.product.count} шт`}</TableCell>
          <TableCell>{`${stat.product.area.round(3)} м²`}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Всего заготовок:</TableCell>
          <TableCell>{`${stat.debit.count} шт`}</TableCell>
          <TableCell>{`${stat.debit.area.round(3)} м²`}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Деловая обрезь:</TableCell>
          <TableCell>{`${stat.credit.count} шт`}</TableCell>
          <TableCell>{`${stat.credit.area.round(3)} м²`}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Коэффициент общий:</TableCell>
          <TableCell>{`${(stat.product.area * 100 / stat.debit.area).round()} % (использовано)`}</TableCell>
          <TableCell>{`${100 - (stat.product.area * 100 / stat.debit.area).round()} % (отход)`}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>С учетом деловой обрези:</TableCell>
          <TableCell>{`${(stat.product.area * 100 / stat.useArea).round()} % (использовано)`}</TableCell>
          <TableCell>{`${100 - (stat.product.area * 100 / stat.useArea).round()} % (отход)`}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </>;
}
