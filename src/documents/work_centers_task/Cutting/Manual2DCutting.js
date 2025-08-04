import React from 'react';
import Canvas from './Canvas';
import ManualToolbar from './ManualToolbar';

export default function Manual2DCutting({obj, row, setExt}) {
  const {nom, len, width, cuts, initial, products} = React.useMemo(() => {
    const {nom, len, width, stick} = row;
    const cuts = new Map();
    let initial = null;
    for(const crow of obj.cuts) {
      if(crow.nom === nom && crow.record_kind.is('Приход') && (crow.len >= len && crow.width >= width || crow.len >= width && crow.width >= len)) {
        const currentProducts = [];
        obj.cutting.find_rows({stick: crow.stick}, (prow) => {
          currentProducts.push(prow);
        });
        cuts.set(crow, currentProducts);
        if(crow.stick === stick) {
          initial = crow;
        }
      }
    }
    if(!initial && cuts.size === 1) {
      initial = Array.from(cuts.keys())[0];
    }
    const products = [row];
    return {nom, len, width, cuts, initial, products};
  }, [row]);
  const [currentProduct, setProduct] = React.useState(row);
  const [currentCut, setCut] = React.useState(initial);
  const [refresh, rawSetRefresh] = React.useState(0);
  const setRefresh = () => rawSetRefresh(refresh + 1);
  return <>
    <ManualToolbar
      title={nom.name}
      setExt={setExt}
      cuts={cuts}
      currentCut={currentCut}
      setCut={setCut}
      products={products}
      currentProduct={currentProduct}
      setProduct={setProduct}
      setRefresh={setRefresh}
    />
    <Canvas
      cuts={cuts}
      currentProduct={currentProduct}
      setProduct={setProduct}
      currentCut={currentCut}
      setCut={setCut}
      rotated={Boolean(currentProduct?.rotated)}
    />
  </>;
}
