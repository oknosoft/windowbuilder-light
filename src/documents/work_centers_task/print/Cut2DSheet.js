import React from 'react';
import paper from 'paper/dist/paper-core';

const {Path, PointText} = paper;

const fontSize = 70;

const pathAttr = {
  strokeColor: 'black',
  strokeWidth: 1,
  strokeScaling: false,
};
const cutAttr = {
  strokeColor: 'blue',
  strokeWidth: 1,
  strokeScaling: false,
  dashArray: [6, 8],
}

function zoom_fit({activeLayer, view}) {

  const bounds = activeLayer.strokeBounds;

  const space = 70, min = 700;
  let {width, height, center} = bounds;
  if (width < min) {
    width = min;
  }
  if (height < min) {
    height = min;
  }
  width += space;
  height += space;
  const zoom = Math.min(view.viewSize.height / height, view.viewSize.width / width);
  const {scaling} = view._decompose();
  view.scaling = [Math.sign(scaling.x) * zoom, Math.sign(scaling.y) * zoom];

  const dx = view.viewSize.width - width * zoom;
  view.center = center.add([Math.sign(scaling.y) * dx / 2, 20]);
}

function wrapper(scrap, projects) {
  return function draw(el) {

    const project = new paper.Project(el);

    const products = scrap._owner._owner.cutting.find_rows({stick: scrap.stick})

    const dx = 0; //options?.edges?.dx || 0;
    const dy = 0; //options?.edges?.dy || 0;

    const path = new Path.Rectangle(-0.5, -0.5 - dy, scrap.len + 1 + dx /2, scrap.width + 1 + dy /2);
    path.set(Object.assign({}, pathAttr, {strokeWidth: 2}));

    for(const product of products) {
      const path = new Path.Rectangle(
        product.x + dx,
        scrap.width - product.y - dy,
        product.len,
        -product.width);
      path.set(pathAttr);
      const {bounds} = path;
      let text = new PointText({
        content: product.width.toFixed(),
        fontSize,
      });
      text.position = bounds.bottomCenter.add([0, -text.bounds.height/2]);
      text = new PointText({
        content: product.len.toFixed(),
        rotation: -90,
        fontSize,
      });
      text.position = bounds.leftCenter.add([text.bounds.width/2 + 8, 0]);
      if(product.info) {
        text = new PointText({
          point: bounds.center,
          content: product.info,
          justification: 'center',
          fontSize: fontSize * 0.8,
        });
      }
    }

    /*
    scrap.scraps = scrapsOut.filter(v => v.id === scrap.id);
    for(const product of scrap.scraps) {
      const path = new Path.Rectangle(
        product.x + dx,
        scrap.height - product.y - dy,
        product.length,
        -product.height
      );
      path.set(cutAttr);
      const {bounds} = path;
      let text = new PointText({
        content: product.length.toFixed(),
        fontSize,
        fillColor: 'blue',
      });
      text.position = bounds.bottomCenter.add([0, -text.bounds.height/2]);
      text = new PointText({
        content: product.height.toFixed(),
        rotation: -90,
        fontSize,
        fillColor: 'blue',
      });
      text.position = bounds.leftCenter.add([text.bounds.width/2 + 8, 0]);
    }
    */

    zoom_fit(project);
    projects.push(project);

  }
}

export function Cut2DSheet({row, projects}) {
  return <div className="sheet">
    <div className="head">
      {`Лист №${row.stick} - ${row.nom.name} (${row.width}x${row.len})`}
    </div>
    <div className="table">
      <canvas className="canvas" ref={wrapper(row, projects)}></canvas>
      <div className="info"></div>
    </div>
  </div>;
}
