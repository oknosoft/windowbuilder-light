import React from 'react';
import {styled} from '@mui/material/styles';
import DataGrid from 'react-data-grid';
import {rowKeyGetter, preventDefault} from '../../metadata/dataGrid';

const rows = [
  {
    ref: 'day-0',
    period: 'Сегодня',
    lead: 0,
  },
  {
    ref: 'day-1',
    period: 'Вчера',
    lead: 0,
  },
  {
    ref: 'day-2',
    period: 'С начала недели',
    lead: 0,
  },
  {
    ref: 'day-3',
    period: 'Неделя',
    lead: 0,
  },
  {
    ref: 'day-4',
    period: 'С начала месяца',
    lead: 0,
  },
  {
    ref: 'day-5',
    period: 'Месяц',
    lead: 0,
  },
  {
    ref: 'day-6',
    period: 'Прошлый месяц',
    lead: 0,
  }
];

const summaryRows = [{ref: 'header'}];

const Summary = styled('div')(() => ({
  marginLeft: -7,
  marginRight: -7,
  paddingLeft: 7,
  paddingRight: 7,
  color: '#666',
  backgroundColor: 'var(--rdg-header-background-color)',
}));

function summaryFormatter({column}) {
  let text = '';
  if(column.key.endsWith('M')) {
    text = 'Сумма';
  }
  else if(column.key.endsWith('A')) {
    text = 'Площадь';
  }
  else if(column.key.endsWith('Q')) {
    text = 'Количество';
  }
  return <Summary>{text}</Summary>;
}

const columns = [
  {key: 'period', name: 'Период', frozen: true, summaryFormatter},
  {key: 'leadQ', name: 'Лиды', summaryFormatter},
  {key: 'calcQ', name: 'Расчёты', summaryFormatter, colSpan(args) {return args.type === 'HEADER' ? 2 : undefined;}},
  {key: 'calcM', name: 'Сумма', summaryFormatter},
  {key: 'orderQ', name: 'Заказы', summaryFormatter, colSpan(args) {return args.type === 'HEADER' ? 2 : undefined;}},
  {key: 'orderM', name: 'Сумма', summaryFormatter},
  {key: 'prodQ', name: 'Изделия', summaryFormatter, colSpan(args) {return args.type === 'HEADER' ? 3 : undefined;}},
  {key: 'prodA', name: 'Площадь', summaryFormatter},
  {key: 'prodM', name: 'Сумма', summaryFormatter},
  {key: 'payM', name: 'Оплаты', summaryFormatter},
  {key: 'shipM', name: 'Отгрузки', summaryFormatter},
];

export default function Report(props) {
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      topSummaryRows={summaryRows}
      rowKeyGetter={rowKeyGetter}
      rowHeight={33}
      className="fill-grid"
      rowClass={(row) => {
        if(row) {

        }
      }}
    />
  );
}
