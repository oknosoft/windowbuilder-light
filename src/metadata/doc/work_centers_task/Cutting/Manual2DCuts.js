import React from 'react';
import Canvas from './Canvas';
import ManualToolbar from './ManualToolbar';

export default function Manual2DCuts({obj, row, setExt}) {
  const {nom, cuts} = React.useMemo(() => {
    const {nom, len, width, stick} = row;
    const products = [];
    obj.cutting.find_rows({stick}, (prow) => {
      products.push(prow);
    });
    const cuts = new Map([[row, products]]);
    return {nom, cuts};
  }, [row]);
  const [currentProduct, setProduct] = React.useState(null);
  const [currentCut, setCut] = React.useState(row);
  return <>
    <ManualToolbar
      title={nom.name}
      setExt={setExt}
      cuts={cuts}
      currentCut={currentCut}
      setCut={setCut}
    />
    <Canvas
      cuts={cuts}
      currentProduct={currentProduct}
      setProduct={setProduct}
      currentCut={currentCut}
      setCut={setCut}
    />
  </>;
}
