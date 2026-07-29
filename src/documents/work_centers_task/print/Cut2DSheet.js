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
  fillColor: new paper.Color('blue'),
};
cutAttr.fillColor.alpha = 0.08;

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
  const min = Math.min(bounds.width, bounds.height);
  const partner = calc_order.client_of_dealer ? `${calc_order.client_of_dealer} ${calc_order.partner.name}` : calc_order.partner.name;
  const info = {
    partner,
    size: prod_name?.main[1] || 'Ошибка продукции',
    number: `${calc_order.number_doc}/${obj.product.pad(2)} (${specimen} из ${obj.calc_order_row?.quantity || '?'})`,
    other,
  };
  const index = infos.push(info);
  if(size > 800 && min > 300) {
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
    let content = `(${index.toFixed()}) ${partner}\n${info.size} ${info.number}`;
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
    const text = new PointText({
      point: bounds.center,
      content: `(${index.toFixed()})`,
      justification: 'center',
      fontSize: fontSize,
    });
    if(hor.bounds.intersects(text.bounds) || hor.bounds.contains(text.bounds)) {
      hor.translate([hor.bounds.width, 0]);
    }
    if(vert.bounds.intersects(text.bounds) || vert.bounds.contains(text.bounds)) {
      vert.translate([0, -vert.bounds.height]);
    }
  }
}

function wrapper(scrap) {
  return function draw(el) {

    if(!el) {
      return;
    }

    const canvas = document.createElement('CANVAS');
    canvas.height = 480;
    canvas.width = 640;
    const project = new paper.Project(canvas);

    const products = scrap._owner._owner.cutting.find_rows({stick: scrap.stick});
    const scraps = scrap._owner.find_rows({stick: scrap.stick, record_kind: 'Расход'});

    const edges = {
      bottom: scrap.nom._extra('edgeBottom'),
      top: scrap.nom._extra('edgeTop'),
      left: scrap.nom._extra('edgeLeft'),
      right: scrap.nom._extra('edgeRight')
    };
    const dx = edges.left || edges.right || 15; //options?.edges?.dx || 0;
    const dy = edges.top || edges.bottom || 15; //options?.edges?.dy || 0;

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
      const hor = new PointText({content: len.toFixed(), fontSize});
      hor.position = bounds.bottomCenter.add([0, -hor.bounds.height/2]);
      const vert = new PointText({content: width.toFixed(), rotation: -90, fontSize});
      vert.position = bounds.leftCenter.add([vert.bounds.width/2 + 8, 0]);
      draw_info({product: product._row, bounds: bounds.clone({insert: false}), hor, vert, infos});
    }

    for(const product of scraps) {
      let {x, y, len, width} = product;
      const path = new Path.Rectangle(
        x + dx,
        scrap.width - y - dy,
        len,
        -width);
      path.set(cutAttr);
      const {bounds} = path;
      const hor = new PointText({content: len.toFixed(), fontSize});
      hor.position = bounds.bottomCenter.add([0, -hor.bounds.height/2]);
      const vert = new PointText({content: width.toFixed(), rotation: -90, fontSize});
      vert.position = bounds.leftCenter.add([vert.bounds.width/2 + 8, 0]);
    }

    zoom_fit(project);
    const svg = project.exportSVG({
      precision: 2,
      matchShapes: true,
      onExport: (item, node) => {
        if (item._class === 'PointText') {
          node.textContent = null;
          for (let i = 0; i < item._lines.length; i++) {
            let tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan.textContent = `\u200b${item._lines[i]}`;
            let dy = item.leading;
            if (i === 0) {
              dy = 0;
            }
            tspan.setAttributeNS(null, 'x', node.getAttribute('x'));
            tspan.setAttributeNS(null, 'dy', dy);
            node.appendChild(tspan);
          }
        }
        return node;
      }
    });
    project.remove();
    svg.attributes.removeNamedItem('height');
    svg.attributes.width.value = '100%';
    el.appendChild(svg);
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

export function Cut2DSheet({row, obj}) {
  return <div className="sheet">
    <div className="head">
      {`Задание ${obj.number_doc.slice(-4)} от ${moment(obj.date).format(moment._masks.date)}. Лист №${row.stick} - ${row.nom.name} (${row.width}x${row.len})`}
    </div>
    <div className="table">
      <div className="canvas" ref={wrapper(row)}></div>
      <div className="info">
        <table className="infos"></table>
      </div>
    </div>
  </div>;
}
