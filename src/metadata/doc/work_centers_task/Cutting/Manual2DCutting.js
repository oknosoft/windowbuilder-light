import React from 'react';
import Canvas from './Canvas';

export default function Manual2DCutting({obj, row}) {
  const {nom, cuts, initial} = React.useMemo(() => {
    const {nom, len, width, stick} = row;
    const cuts = new Map();
    let initial = null;
    for(const crow of obj.cuts) {
      if(crow.nom === nom && crow.record_kind.is('Приход') && (crow.len >= len && crow.width >= width || crow.len >= width && crow.width >= len)) {
        const products = [];
        obj.cutting.find_rows({stick: crow.stick}, (prow) => {
          products.push(prow);
        })
        cuts.set(crow, products);
        if(crow.stick === stick) {
          initial = crow;
        }
      }
    }
    return {nom, cuts, initial};
  }, [row]);
  const [currentProduct, setProduct] = React.useState(row);
  const [currentCut, setCut] = React.useState(initial);
  return <>
    `Manual2D ${nom.name}`
    <Canvas
      cuts={cuts}
      currentProduct={currentProduct}
      setProduct={setProduct}
      currentCut={currentCut}
      setCut={setCut}
    />
  </>;
}
