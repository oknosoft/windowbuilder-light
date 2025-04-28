import React from 'react';
import Canvas from './Canvas';
import ManualToolbar from './ManualToolbar';

export default function Manual2DCutting({obj, row, setExt}) {
  const {nom, len, width, cuts, initial, handleClose} = React.useMemo(() => {
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
    if(!initial && cuts.size === 1) {
      initial = Array.from(cuts.keys())[0];
    }
    return {nom, len, width, cuts, initial};
  }, [row]);
  const [currentProduct, setProduct] = React.useState(row);
  const [currentCut, setCut] = React.useState(initial);
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
