import React from 'react';
import IconButton from '@mui/material/IconButton';
import {HtmlTooltip} from '../../../aggregate/App/styled';
import DxfIcon from '../../../styles/icons/DxfFile';

/*
рассчитать knotvalues для spline из svg
1. Стандартный способ: Зажатый (Clamped) вектор узловЕсли вы объединяете несколько последовательных кубических кривых Безье из SVG в один B-сплайновый путь,
 стандартный и самый простой способ — использовать неравномерный зажатый вектор узлов (Non-uniform Clamped Knot Vector).
 Правила его формирования для сплайна степени p = 3 (кубический):
 Начальный узел повторяется p + 1 раз (то есть 4 раза).Каждая точка склейки сегментов Безье увеличивает кратность внутреннего узла до p (то есть 3 раза), чтобы кривая точно проходила через опорные точки SVG и могла иметь излом (непрерывность C⁰). Если вам нужна идеальная гладкость C², кривую Безье нужно предварительно пересчитать, но SVG по умолчанию гарантирует только C⁰ на стыках, если авторы не выровняли тангенсы вручную.Конечный узел повторяется p + 1 раз (то есть 4 раза).
 Пример расчета:
 Допустим, ваш SVG состоит из двух сегментов Безье (например, M 0 0 C 1 1, 2 2, 3 3 C 4 4, 5 5, 6 6).У вас есть 2 сегмента. Обычные значения параметров для них: от 0 до 1 для первого, от 1 до 2 для второго (или от 0.5 до 1.0, важна пропорция).
 Вектор узлов (Knot Vector) будет выглядеть так:[0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2]
 0, 0, 0, 0 — зажатое начало (4 повторения)1, 1, 1 — стык между первым и вторым сегментом Безье (3 повторения)2, 2, 2, 2 — зажатый конец (4 повторения)
 2. Формула для N сегментов SVGЕсли ваш SVG-путь содержит N последовательных кубических кривых Безье:
 Количество сегментов: NВнутренние границы: \(t_0, t_1, t_2, ..., t_N\) (обычно это просто целые числа от 0 до N).Вектор узлов:
 \[K=[\,\underbrace{t_{0},\dots ,t_{0}}_{4},\,\underbrace{t_{1},\dots ,t_{1}}_{3},\,\underbrace{t_{2},\dots ,t_{2}}_{3},\,\dots ,\,\underbrace{t_{N-1},\dots ,t_{N-1}}_{3},\,\underbrace{t_{N},\dots ,t_{N}}_{4}\,]\]Конечная длина массива knotvalues составит: 4 + 3 × (N - 1) + 4 = 3N + 5.
 3. Нормализованный вектор (от 0.0 до 1.0)Часто библиотеки (например, в Three.js, OpenCASCADE, Rhino или различных CAD-системах) требуют, чтобы значения узлов находились строго в диапазоне от 0.0 до 1.0.
 Для тех же 2 сегментов Безье нормализованный вектор узлов будет:[0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0]
 Для 3 сегментов:[0.0, 0.0, 0.0, 0.0, 0.333, 0.333, 0.333, 0.666, 0.666, 0.666, 1.0, 1.0, 1.0, 1.0]
 Как это использовать в коде (Контрольные точки)Чтобы этот вектор узлов работал правильно, массив ваших контрольных точек (Control Points) для B-сплайна должен состоять из всех точек SVG кривой подряд:[Старт, Контрольная1, Контрольная2, Конец1/Старт2, Контрольная3, Контрольная4, Конец2...]
*/

const {EditorInvisible, ui: {dialogs}, utils} = $p;

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

async function parseSegments(text) {
  const DxfParser = (await import('dxf-parser')).default;
  const parser = new DxfParser();
  const paper = new EditorInvisible();
  const project = paper.create_scheme();
  const dxf = parser.parse(text);
  //nurbs
  for(const item of dxf.entities) {
    const segments = [];
    switch (item.type) {
      case 'ELLIPSE': {
        const {axisRatio, center, startAngle, endAngle, majorAxisEndPoint: pt} = item;
        const r = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
        const ellipse = new paper.Path.Ellipse({
          insert: false,
          center,
          radius: [r, r * axisRatio],
        });
        const {length} = ellipse;
        const points = [];
        const step = length / 89;
        for(let t= length * 0.875; t < length; t+=step) {
          points.push(ellipse.getPointAt(t));
        }
        for(let t= 0; t < length * 0.125; t+=step) {
          points.push(ellipse.getPointAt(t));
        }
        segments.push({kind: 'curve', points: [...points]});
        points.length = 0;
        points.push(segments[0].points[segments[0].points.length-1]);
        for(let t= length * 0.125; t < length * 0.375; t+=step) {
          points.push(ellipse.getPointAt(t));
        }
        segments.push({kind: 'curve', points: [...points]});
        points.length = 0;
        points.push(segments[1].points[segments[1].points.length-1]);
        for(let t= length * 0.375; t < length * 0.625; t+=step) {
          points.push(ellipse.getPointAt(t));
        }
        segments.push({kind: 'curve', points: [...points]});
        points.length = 0;
        points.push(segments[2].points[segments[2].points.length-1]);
        for(let t= length * 0.625; t < length * 0.875; t+=step) {
          points.push(ellipse.getPointAt(t));
        }
        points.push(segments[0].points[0]);
        segments.push({kind: 'curve', points: [...points]});
        break;
      }
      case 'SPLINE': {
        const {degreeOfSplineCurve: degree, controlPoints, knotValues} = item;
        const points = controlPoints.map(v => [v.x, -v.y]);
        const kinks = Array.from(new Set(knotValues));
        for(let i=1; i<kinks.length; i++) {
          const pts = [
            interpolate(kinks[i-1], degree, points, knotValues),
            interpolate(kinks[i-1] + 0.003, degree, points, knotValues),
            interpolate((kinks[i-1] + kinks[i]) / 2, degree, points, knotValues),
            interpolate(kinks[i] - 0.003, degree, points, knotValues),
            interpolate(kinks[i], degree, points, knotValues),
          ].map(([x, y]) => ({x, y}));
          if(isLinear(pts, paper)) {
            segments.push({kind: 'line', points: [new paper.Point(pts[0]), new paper.Point(pts[4])]});
          }
          else {
            const curvePts = [pts[0]];
            const delta = kinks[i] - kinks[i-1];
            const step = delta/20;
            for(let j=kinks[i-1]+step; j<=kinks[i]-step; j+=step) {
              curvePts.push(interpolate(j, degree, points, knotValues));
            }
            curvePts.push(pts[4]);
            segments.push({kind: 'curve', points: curvePts.map(v => new paper.Point(v))});
          }
        }
        let left = Infinity;
        for(const segm of segments) {
          const {points} = segm;
          segm.left = points.reduce((sum, curr) => sum + curr.x, 0) / points.length;
          if(left > segm.left) {
            left = segm.left;
          }
        }
        const leftIndex = segments.indexOf(segments.find(v => v.left === left));
        if(leftIndex > 0) {
          for (let i=leftIndex; i>0; i--) {
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
    if(segments.length) {
      for(const segm of segments) {
        const {points, kind} = segm;
        segm.path = new paper.Path({
          insert: false,
          segments: points,
        });
        if(kind !== 'line') {
          segm.path.simplify(0.3);
        }
        delete segm.points;
      }
      return [segments, paper];
    }
  }
  return [null, paper];
}

export function FromDXF ({obj, getRow, methods, rawSetSelectedRows}) {

  const inputRef = React.createRef();

  function openDXF(e) {
    inputRef.current?.showPicker(e);
  }

  function handleFileChange({target}) {
    const file = target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async ({target}) => {
      let editor;
      try {
        const [segments, paper] = await parseSegments(target.result);
        editor = paper;
        if(segments) {
          let row = getRow();
          if(row) {
            const query = await dialogs.alert({
              title: 'Куда поместить фигуру?',
              text: `В новую строку заказа (Ок)\nВ текущее изделие (Отмена)`,
            });
            if(!query) {
              row = null;
            }
          }
          if(!row) {
            row = await methods.create();
          }
          if(segments.length === 4) {
            const {characteristic, editor: {project}} = row.row;
            segments.forEach(({path}, index) => {
              const crow = characteristic.coordinates.get(index);
              crow.len = path.length;
              crow.path_data = path.pathData;
              crow.x1 = path.firstSegment.point.x;
              crow.y1 = path.firstSegment.point.y;
              crow.x2 = path.lastSegment.point.x;
              crow.y2 = path.lastSegment.point.y;
            });
            await project.load(characteristic, true, characteristic.calc_order);
            project.redraw();
            await row.row.recalcFin();
            rawSetSelectedRows?.(new Set([row.key]));
          }
          else {
            dialogs.alert({
              title: 'Мало сегментов',
              text: `Импорт из dxf с треугольников и арок, пока не поддержан`,
            });
          }
        }
      }
      catch (err) {
        console.error(err.stack);
      }
      finally {
        editor.unload();
      }
    };
    reader.readAsText(file); // или readAsDataURL для картинок
  }

  return <HtmlTooltip title="Прочитать DXF">
    <IconButton onClick={openDXF}><DxfIcon/></IconButton>
    <input ref={inputRef} type="file" onChange={handleFileChange} accept=".dxf" style={{display: 'none'}} />
  </HtmlTooltip>
}
