import * as THREE from 'three';

import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
const loader = new SVGLoader();
const ramaSvg = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><g>
<path d="m 70.348683,-57.957608
h -4.6
v 1.7
h 1.7 1.2
v 4.5
h -1.2 -1.7
v 1.7
h 1.7 1.2
v 14.100001
h -1.2
v 1.2
h 1.2
v 3.8
h -19 -26 -5
v -4.6
h -1.7
v 4.6
H 2.0486845
v -4.6
H 0.34868451
v 4.6 1.7
H 8.3486845
V -6.6576072
H 0.34868451
v 6.59999997
H 2.0486845
V -5.0576072
H 17.048683
v 4.59999997
h 1.7
V -5.1576072
l 49.9,0.2
v 3.3
h -1.7
v 1.69999997
h 3.4
z" stroke="#000000"></path>
</g></svg>`);
const shape = ramaSvg.paths[0].toShapes(true)[0];



export default shape;

/*
const shape = new THREE.Shape();
const arcLengthDivisions = 200;
const raw = {
  arcLengthDivisions,
  type: "Shape",
  autoClose: false,
  curves: [{
    arcLengthDivisions,
    type: "LineCurve",
    v1: [0, 0],
    v2: [4.6, 0]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [4.6, 0],
    v2: [4.6, 1.7]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [4.6, 1.7],
    v2: [2.8999999999999995, 1.7]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [2.8999999999999995, 1.7],
    v2: [1.6999999999999995, 1.7]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [1.6999999999999995, 1.7],
    v2: [1.6999999999999995, 6.2]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [1.6999999999999995, 6.2],
    v2: [2.8999999999999995, 6.2]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [2.8999999999999995, 6.2],
    v2: [4.6, 6.2]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [4.6, 6.2],
    v2: [4.6, 7.9]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [4.6, 7.9],
    v2: [2.8999999999999995, 7.9]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [2.8999999999999995, 7.9],
    v2: [1.6999999999999995, 7.9]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [1.6999999999999995, 7.9],
    v2: [1.7, 22]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [1.7, 22],
    v2: [2.9, 22]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [2.9, 22],
    v2: [2.9, 23.2]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [2.9, 23.2],
    v2: [1.7, 23.2]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [1.7, 23.2],
    v2: [1.7, 27]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [1.7, 27],
    v2: [20.7, 27]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [20.7, 27],
    v2: [46.7, 27]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [46.7, 27],
    v2: [51.7, 27]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [51.7, 27],
    v2: [51.7, 22.4]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [51.7, 22.4],
    v2: [53.400000000000006, 22.4]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [53.400000000000006, 22.4],
    v2: [53.400000000000006, 27]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [53.400000000000006, 27],
    v2: [68.3, 27]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [68.3, 27],
    v2: [68.3, 22.4]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [68.3, 22.4],
    v2: [70, 22.4]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [70, 22.4],
    v2: [70, 27]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [70, 27],
    v2: [70, 28.7]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [70, 28.7],
    v2: [62, 28.7]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [62, 28.7],
    v2: [62, 51.3]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [62, 51.3],
    v2: [70, 51.3]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [70, 51.3],
    v2: [70, 57.9]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [70, 57.9],
    v2: [68.3, 57.9]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [68.3, 57.9],
    v2: [68.3, 52.9]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [68.3, 52.9],
    v2: [53.3, 52.9]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [53.3, 52.9],
    v2: [53.3, 57.5]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [53.3, 57.5],
    v2: [51.599999999999994, 57.5]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [51.599999999999994, 57.5],
    v2: [51.599999999999994, 52.8]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [51.599999999999994, 52.8],
    v2: [1.7, 53]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [1.7, 53],
    v2: [1.7, 56.3]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [1.7, 56.3],
    v2: [3.4, 56.3]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [3.4, 56.3],
    v2: [3.4, 58]
  }, {
    arcLengthDivisions,
    type: "LineCurve",
    v1: [3.4, 58],
    v2: [0, 58]
  }],
  currentPoint: [0, 0],
  uuid: "27ed6134-0285-4942-b0bb-b88e6585dc7f",
  holes: [],
};
const flipX = () => {
  for(const curve of raw.curves) {
    if(curve.type === "LineCurve") {
      //curve.v1[1] = -curve.v1[1];
      //curve.v2[1] = -curve.v2[1];
      //curve.v1[0] = -curve.v1[0];
      //curve.v2[0] = -curve.v2[0];
    }
  }
};
flipX();
shape.fromJSON(raw);
*/
