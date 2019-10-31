// модификаторы справочников


export default function ($p) {
  $p.cat.forEach((mgr) => {
    if(mgr.cachable === 'doc' && mgr.class_name !== 'cat.characteristics') {
      mgr._cachable = 'ram';
    }
  });
}
