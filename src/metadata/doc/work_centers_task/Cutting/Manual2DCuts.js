import React from 'react';
import Canvas from './Canvas';

export default function Manual2DCuts({obj, row}) {
  const {nom, len, width, cuts} = React.useMemo(() => {
    const {nom, len, width, stick} = row;
    const products = [];
    obj.cutting.find_rows({stick}, (prow) => {
      products.push(prow);
    });
    const cuts = new Map([row, products]);
    return {nom, len, width, cuts};
  }, [row]);
  const [currentProduct, setProduct] = React.useState(null);
  const [currentCut, setCut] = React.useState(row);
  return <>
    `Manual2DCuts ${row.nom.name}`
    <Canvas
      cuts={cuts}
      currentProduct={currentProduct}
      setProduct={setProduct}
      currentCut={currentCut}
      setCut={setCut}
    />
  </>;
}
