import React from 'react';

export function Cut2DSheet({row}) {
  return <div className="sheet">
    <div className="head">
      {`Лист №${row.stick} - ${row.nom.name} (${row.width}x${row.len})`}
    </div>
    <div className="table">
      <canvas className="canvas"></canvas>
      <div className="info"></div>
    </div>
  </div>;
}
