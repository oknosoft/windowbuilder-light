import React from 'react';

export function Sticker({row}) {
  const {calc_order, obj, part, _owner: {_owner}, svg} = row;
  const ox = obj.obj;
  const glassRow = ox.coordinates.find({elm_type: 'Стекло'});
  const prod_name = glassRow ? ox.prod_name2({elm: glassRow.elm, cnstr: glassRow.cnstr}) : null;
  const other = prod_name?.other || [];
  return <article>
    <div className='partner nowrap'>{calc_order.partner.name}</div>
    <div className='txt nowrap'>{`${calc_order.number_doc}/${ox.product.pad(2)} (${obj.specimen} из ${ox.calc_order_row?.quantity || '?'}) `}<small>{`// ${_owner.number_doc}`}</small></div>
    <div className='txt nowrap'>{`${calc_order.note}`}</div>
    <div className='flex'>
      <div className='qr' dangerouslySetInnerHTML={{__html: svg}} />
      <div>
        {other.length < 3 ? <div className='txt' /> : null}
        <div className='large nowrap'>{prod_name?.main.reverse().join(' ') || 'Ошибка продукции'}</div>
        <span className='txt multiline-nowrap' dangerouslySetInnerHTML={{__html: other.join('<br/>')}}/>
      </div>
    </div>
  </article>;
}
