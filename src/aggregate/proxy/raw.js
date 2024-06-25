
function stream_load({manifest, md, adapters, headers}) {

  let res = Promise.resolve();
  for(const type in manifest) {
    res = res
      .then(() => adapters.fetch(`/raw/${type}.json`, {headers}))
      .then(res => res.json())
      .then(rows => {
        const mgr = md.mgr(type);
        mgr?.load(rows, true);
      });
  }
  return res;
}

export function load_raw({adapters, jobPrm, md, msg}) {
  const headers = new Headers();
  return adapters.fetch(`/raw/manifest.json`, {headers})
    .then(res => res.json())
    .then((manifest) => stream_load({manifest, md, adapters, headers}))
    .catch((err) => {
      return err;
    })
    .then((err) => {
      if(err instanceof Error) {
        throw err;
      }
    });

}
