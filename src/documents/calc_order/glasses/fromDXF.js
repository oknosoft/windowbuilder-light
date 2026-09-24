import React from 'react';
import IconButton from '@mui/material/IconButton';
import {HtmlTooltip} from '../../../aggregate/App/styled';
import DxfIcon from '../../../styles/icons/DxfFile';



function interpolate(t, degree, points, knots) {

  let i,j,s,l;              // function-scoped iteration variables
  const n = points.length;    // points count
  const d = points[0].length; // point dimensionality
  const v = points.map(v => [...v, 1]); // convert points to homogeneous coordinates

  if(degree < 1) throw new Error('degree must be at least 1 (linear)');
  if(degree > (n-1)) throw new Error('degree must be less than or equal to point count - 1');

  let domain = [
    degree,
    knots.length-1 - degree
  ];

  // remap t to the domain where the spline is defined
  let low  = knots[domain[0]];
  let high = knots[domain[1]];
  t = t * (high - low) + low;

  if(t < low || t > high) throw new Error('out of bounds');

  // find s (the spline segment) for the [t] value provided
  for(s=domain[0]; s<domain[1]; s++) {
    if(t >= knots[s] && t <= knots[s+1]) {
      break;
    }
  }

  // l (level) goes from 1 to the curve degree + 1
  let alpha;
  for(l=1; l<=degree+1; l++) {
    // build level l of the pyramid
    for(i=s; i>s-degree-1+l; i--) {
      alpha = (t - knots[i]) / (knots[i+degree+1-l] - knots[i]);

      // interpolate each component
      for(j=0; j<d+1; j++) {
        v[i][j] = (1 - alpha) * v[i-1][j] + alpha * v[i][j];
      }
    }
  }

  // convert back to cartesian and return
  let result = [];
  for(i=0; i<d; i++) {
    result[i] = v[s][i];
  }

  return result;
}

function isLinear(pts, paper) {
  const line = new paper.Line(pts[0], pts[4]);
  for(let i=1; i<4; i++) {
    if(line.getDistance(pts[i]) > 0.001) {
      return false;
    }
  }
  return true;
}

export function FromDXF () {

  const inputRef = React.createRef();

  function openDXF(e) {
    inputRef.current?.showPicker(e);
  }

  function handleFileChange({target}) {
    const file = target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async ({target}) => {
      const DxfParser = (await import('dxf-parser')).default;
      const parser = new DxfParser();
      const paper = (await import('paper/dist/paper-core')).default;
      try {
        const dxf = parser.parse(target.result);
        //nurbs
        for(const item of dxf.entities) {
          switch (item.type) {
            case 'ELLIPSE': {
              const {axisRatio, center, startAngle, endAngle, majorAxisEndPoint: pt} = item;
              const r = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
              if(startAngle < 0.01 || Math.abs(Math.PI - startAngle) < 0.01) {

              }
              else if(Math.abs(Math.PI / 2 - startAngle) < 0.01 || Math.abs(Math.PI + Math.PI / 2 - startAngle) < 0.01) {

              }
              const ellipse = new paper.Path.Ellipse({
                insert: false,
                center,
                radius: [r, r * axisRatio],
              });
              break;
            }
            case 'SPLINE': {
              const {degreeOfSplineCurve: degree, controlPoints, knotValues} = item;
              const points = controlPoints.map(v => [v.x, -v.y]);
              const kinks = Array.from(new Set(knotValues));
              const segments = [];
              for(let i=1; i<kinks.length; i++) {
                const pts = [
                  interpolate(kinks[i-1], degree, points, knotValues),
                  interpolate(kinks[i-1] + 0.003, degree, points, knotValues),
                  interpolate((kinks[i-1] + kinks[i]) / 2, degree, points, knotValues),
                  interpolate(kinks[i] - 0.003, degree, points, knotValues),
                  interpolate(kinks[i], degree, points, knotValues),
                ].map(([x, y]) => ({x, y}));
                if(isLinear(pts, paper)) {
                  segments.push({kind: 'line', points: [pts[0], pts[4]]});
                }
                else {
                  const curvePts = [pts[0]];
                  const delta = kinks[i] - kinks[i-1];
                  const step = delta/20;
                  for(let j=kinks[i-1]+step; j<=kinks[i]-step; j+=step) {
                    curvePts.push(interpolate(j, degree, points, knotValues));
                  }
                  curvePts.push(pts[4]);
                  segments.push({kind: 'curve', points: curvePts});
                }
              }
              const lineIndex = segments.indexOf(segments.find(v => v.kind === 'line'));
              if(lineIndex > 0) {
                for (let i=lineIndex; i>0; i--) {
                  const shifted = segments.shift();
                  segments.push(shifted);
                }
              }
              while (segments.length > 4) {
                const curved = segments.filter(v => v.kind !== 'line');
                if(curved.length > 1) {
                  let spliced;
                  for(let i=1; i<curved.length; i++) {
                    const c0 = curved[i-1];
                    const c1 = curved[i];
                    const i0 = segments.indexOf(c0);
                    const i1 = segments.indexOf(c1);
                    if(i1 === i0+1) {
                      for(let j=1; j<20; j++) {
                        c0.points.push(c1.points[j]);
                      }
                      segments.splice(i1, 1);
                      spliced = true;
                      break;
                    }
                  }
                  if(spliced) {
                    continue;
                  }
                  else {
                    break;
                  }
                }
              }
              break;
            }
          }
        }
      } catch(err) {
        return console.error(err.stack);
      }
    };
    reader.readAsText(file); // или readAsDataURL для картинок
  }

  return <HtmlTooltip title="Прочитать DXF">
    <IconButton onClick={openDXF}><DxfIcon/></IconButton>
    <input ref={inputRef} type="file" onChange={handleFileChange} accept=".dxf" style={{display: 'none'}} />
  </HtmlTooltip>
}
