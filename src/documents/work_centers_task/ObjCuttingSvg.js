import React from 'react';
import scale_svg from '../../aggregate/AppLoad/scale_svg';

export default function ObjCuttingSvg({row, height, width}) {
  const svg = row?.dop?.svg ? scale_svg(row.dop.svg, {height, width, zoom: 1}, 8) : 'раскрой не выполнен';
  return <div dangerouslySetInnerHTML={{__html: svg}}/>;
}
