import * as THREE from 'three';

import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
const loader = new SVGLoader();
const ramaSvg = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><g>
<path d="m 70.348683,-40.981074
h -4.6
v 1.7
h 2.9
v 4.5
h -2.9
l 3.17e-4,1.7
h 2.9
l -3.17e-4,14.100001
h -1.2
l 3.17e-4,1.2
h 1.199683
v 3.8
h -50
v -4.6
h -1.7
v 4.6
H 2.0486845
v -4.6
H 0.34868451
v 4.6 1.7
H 8.3486845
v 22.6
H 0.34868451
v 6.6
H 2.0486845
v -5
H 17.048683
v 4.6
h 1.7
v -4.7
l 49.9,0.2 3.17e-4,3.829167
h -1.2
v 1.170833
l 1.2,0.0027
v 24.266176
l -2.899998,6.68e-4
v 2.18348
l 4.599679,0.0053
z" stroke="#000000"></path>
</g></svg>`);
const shape = ramaSvg.paths[0].toShapes(true)[0];



export default shape;
