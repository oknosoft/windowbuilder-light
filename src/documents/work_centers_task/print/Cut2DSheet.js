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

function draw_info({product, bounds, hor, vert, infos}) {
  const {calc_order, obj, specimen} = product.obj;
  const glassRow = obj.coordinates.find({elm_type: 'Стекло'});
  const prod_name = glassRow ? obj.prod_name2({elm: glassRow.elm, cnstr: glassRow.cnstr}) : null;
  const other = prod_name?.other || [];
  if(calc_order.note) {
    other.unshift(calc_order.note);
  }
  const size = Math.max(bounds.width, bounds.height);
  const partner = calc_order.client_of_dealer ? `${calc_order.client_of_dealer} ${calc_order.partner.name}` : calc_order.partner.name;
  const info = {
    partner,
    size: prod_name?.main[1] || 'Ошибка продукции',
    number: `${calc_order.number_doc}/${obj.product.pad(2)} (${specimen} из ${obj.calc_order_row?.quantity || '?'})`,
    other,
  };
  const index = infos.push(info);
  if(size > 800) {
    const rot = bounds.width < bounds.height;
    bounds = bounds.expand(-vert.bounds.width * 1.8, -hor.bounds.height * 1.8);
    bounds.centerY -= hor.bounds.height / 2;
    bounds.centerX += vert.bounds.width / 2;
    if(bounds.height > 2000) {
      bounds = bounds.expand(0, 2000 - bounds.height);
    }
    if(bounds.width > 2000) {
      bounds = bounds.expand(2000 - bounds.width, 0);
    }
    let content = `${index.toFixed()} ${partner}\n${info.size} ${info.number}`;
    if(other.length) {
      content += `\n${other.join(', ')}`;
    }

    const text = new PointText({
      point: bounds.center,
      content,
      justification: 'center',
      fontSize: fontSize,
      rotation: rot ? -90 : 0,
    });
    if(text.bounds.width > bounds.width || text.bounds.height > bounds.height) {
      text.fitBounds(bounds);
    }
  }
  else {
    new PointText({
      point: bounds.center,
      content: index.toFixed(),
      justification: 'center',
      fontSize: fontSize,
    });
  }
}

function wrapper(scrap, projects) {
  return function draw(el) {

    const project = new paper.Project(el);

    const products = scrap._owner._owner.cutting.find_rows({stick: scrap.stick})

    const dx = 0; //options?.edges?.dx || 0;
    const dy = 0; //options?.edges?.dy || 0;

    const path = new Path.Rectangle(-0.5, -0.5 - dy, scrap.len + 1 + dx /2, scrap.width + 1 + dy /2);
    path.set(Object.assign({}, pathAttr, {strokeWidth: 2}));

    const infos = [];

    for(const product of products) {
      let {x, y, len, width, rotated} = product;
      if(rotated) {
        [len, width] = [width, len];
      }
      const path = new Path.Rectangle(
        x + dx,
        scrap.width - y - dy,
        len,
        -width);
      path.set(pathAttr);
      const {bounds} = path;
      const hor = new PointText({
        content: len.toFixed(),
        fontSize,
      });
      hor.position = bounds.bottomCenter.add([0, -hor.bounds.height/2]);
      const vert = new PointText({
        content: width.toFixed(),
        rotation: -90,
        fontSize,
      });
      vert.position = bounds.leftCenter.add([vert.bounds.width/2 + 8, 0]);
      draw_info({product: product._row, bounds: bounds.clone({insert: false}), hor, vert, infos});
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
    sheetInfo(el, infos);

  }
}

function sheetInfo(el, infos) {
  if(el && infos.length) {
    const div = el.parentNode.querySelector('.infos');
    let innerHTML = '';
    infos.forEach((info, index) => {
      innerHTML += `<tr>
<td rowspan="2">${index + 1}</td>
<td>${info.partner}</td>
</tr>
<tr><td>${info.size} ${info.number} ${info.other.join(', ')}</td></tr>
<tr><td colspan="2" class="colspan"></td></tr>`;
    });
    div.innerHTML = innerHTML;
  }
}

export function Cut2DSheet({row, projects}) {
  return <div className="sheet">
    <div className="head">
      {`Лист №${row.stick} - ${row.nom.name} (${row.width}x${row.len})`}
    </div>
    <div className="table">
      <canvas className="canvas" ref={wrapper(row, projects)}></canvas>
      <div className="info">
        <table className="infos"></table>
      </div>
    </div>
  </div>;
}
