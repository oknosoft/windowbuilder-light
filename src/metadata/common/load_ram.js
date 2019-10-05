
export function load_ram({adapters: {pouch}, md}) {
  const {remote: {doc}, props} = pouch;
  pouch.emit('pouch_load_start', {local_rows: 100});
  return fetch(`/couchdb/mdm/${props.zone}/${props._suffix}`, {
    headers: doc.getBasicAuthHeaders({prefix: pouch.auth_prefix(), ...doc.__opts.auth}),
  })
    .then(stream_load(md))
    .then(() => {
      props._data_loaded = true;
      pouch.emit('pouch_data_loaded');
    })
    .then(() => {
      props._doc_ram_loading = true;
      pouch.emit('pouch_doc_ram_start');
    })
    .then(() => {
      props._doc_ram_loading = false;
      props._doc_ram_loaded = true;
      pouch.emit('pouch_doc_ram_loaded');
    });

}

// загружает данные, которые не зависят от отдела абонента
export function load_common({adapters: {pouch}, md}) {
  return fetch(`/couchdb/mdm/${pouch.props.zone}/common`)
    .then(stream_load(md))
    .then(() => pouch.emit('pouch_no_data', 'no_ram'));
}

function stream_load(md) {

  function load(part) {
    const data = JSON.parse(part);
    const mgr = md.mgr_by_class_name(data.name);
    mgr && mgr.load_array(data.rows);
  }

  return async function stream_load({body}) {
    const reader = body.getReader();
    const decoder = new TextDecoder("utf-8");
    let chunks = '';
    for(;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      const text = decoder.decode(value);
      const parts = text.split('\r\n');
      if(!text.endsWith('\r\n')) {
        if(chunks.length) {
          chunks += parts.shift();
          if(parts.length) {
            load(chunks);
            chunks = '';
          }
        }
        if(parts.length) {
          chunks = parts.pop();
        }
      }
      else if(chunks.length) {
        chunks += parts.shift();
        if(parts.length) {
          load(chunks);
          chunks = '';
        }
      }

      for(const part of parts) {
        part && load(part);
      }
    }
  }
}
