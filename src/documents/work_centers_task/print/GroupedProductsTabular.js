import React from 'react';

const aggregator = $p.wsql.alasql.compile(
  `select len, width, number, partner, other, sum(qty) qty
   from ? group by len, width, number, partner, other`);

export default function GroupedProductsTabular({nom, obj}) {
  const rows = [];
  obj.cutting.find_rows({nom}, (src) => {
    const {number_doc, partner, note} = src.production.calc_order;
    const glassRow = src.production.coordinates.find({elm_type: 'Стекло'});
    const {main, other} = src.production.prod_name2({elm: glassRow.elm, cnstr: glassRow.cnstr});
    rows.push({
      len: src.len,
      width: src.width,
      number: parseInt(number_doc.substring(4)).pad(4),
      partner: `${note ? note + ' ' : ''}${partner.name}`,
      other: other.join(','),
      qty: 1,
    })
  });
  const aggregated = aggregator([rows]);
  const tar = {style: {textAlign: 'right'}};

  return <table style={{width: '100%', borderCollapse: 'collapse'}} border={1} cellpadding={4}>
    <thead>
    <tr>
      <th style={{width: '19mm'}}>Длина</th>
      <th style={{width: '19mm'}}>Высота</th>
      <th style={{width: '19mm'}}>Номер</th>
      <th>Контрагент</th>
      <th style={{width: '40mm'}}>Обработки</th>
      <th style={{width: '19mm'}}>Шт</th>
    </tr>
    </thead>
    <tbody>
    {aggregated.map((row, index) => <tr key={index}>
      <td {...tar}>{row.len}</td>
      <td {...tar}>{row.width}</td>
      <td {...tar}>{row.number}</td>
      <td>{row.partner}</td>
      <td>{row.other}</td>
      <td {...tar}>{row.qty}</td>
    </tr>)}
    </tbody>
  </table>;
}
