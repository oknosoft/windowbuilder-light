import React from 'react';
import Canvas from './Canvas';
import ManualToolbar from './ManualToolbar';

export default function Manual2DCuts({obj, row, setExt}) {
  const {nom, cuts, products} = React.useMemo(() => {
    const {nom, len, width, stick} = row;
    const currentProducts = [];
    obj.cutting.find_rows({stick}, (prow) => {
      currentProducts.push(prow);
    });
    const cuts = new Map([[row, currentProducts]]);
    const products = [];
    for(const prow of obj.cutting) {
      if(prow.nom === nom && (prow.len <= len && prow.width <= width || prow.len <= width && prow.width <= len)) {
        products.push(prow);
      }
    }
    return {nom, cuts, products};
  }, [row]);
  const [currentProduct, setProduct] = React.useState(null);
  const [currentCut, setCut] = React.useState(row);
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
