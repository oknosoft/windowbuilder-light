import React from 'react';
import {Canvas} from '../../drawer/Builder/Builder';

export default function PaperlessBuilder({paperless}) {

  const [editor, setEditor] = React.useState();

  const createEditor = (el) => {
    if(el) {
      if(!editor) {
        setEditor(new $p.Editor(el));
      }
    }
  };

  React.useEffect(() => {
    return () => {
      editor?.unload?.();
    };
  }, [editor]);

  React.useEffect(() => {
    editor?.project?.load(paperless.characteristic, false, paperless.calc_order);
  }, [editor, paperless.characteristic]);

  return <Canvas ref={createEditor} />;

}
