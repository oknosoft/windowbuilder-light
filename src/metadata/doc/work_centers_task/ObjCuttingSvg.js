import React from 'react';
import scale_svg from '../../aggregate/scale_svg';

export default function ObjCuttingSvg({row, height}) {
  const svg = row?.dop?.svg ? scale_svg(row.dop.svg, {height, zoom: 1}, 8) : 'раскрой не выполнен';
  return <div dangerouslySetInnerHTML={{__html: svg}}/>;
}
