import React from 'react';

export default function FillingProps({layer, elm}) {
  return <>
    {`Слой ${layer.index}, Заполнение ${elm._index+1}`}
  </>;
}
