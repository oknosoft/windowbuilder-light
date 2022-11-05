/**
 * Отвечает за сдвиг узлов и элементов
 */
export default class Mover {

  constructor(editor) {
    this.editor = editor;
  }

  get project() {
    return this.editor.project;
  }

  /**
   * Маршрутизация к привязке сдвигов
   * @param start
   * @param event
   * @return {Point}
   */
  snap_to_edges({start, event: {point, modifiers}, mode}) {
    const {consts: {move_shapes, move_points}, Path} = this.editor;
    let delta = point.subtract(start);
    if (!modifiers.shift){
      delta = delta.snap_to_angle(Math.PI*2/4);
      point = start.add(delta);
    }

    if(mode === move_shapes) {
      return this.snap_shapes({start, point, delta});
    }

    if(mode === move_points) {
      return this.snap_points({start, point, delta});
    }
  }

  /**
   * Возврвщает вектор, на который можно сдвинуть узлы
   * @param start
   * @param point
   * @return {Point}
   */
  snap_points({start, point, delta}) {
    // в режиме move_points, обрабатываем только один узел
    const {Path} = this.editor;
    const vertexes = new Map();
    const tvertexes = new Map();

    // ищем первый узел
    for(const profile of this.project.selected_profiles()) {
      const {skeleton} = profile;
      for(const vertex of skeleton.vertexesByProfile(profile)) {
        if(vertex.selected) {
          vertexes.set(vertex, [{skeleton, profile, ribs: new Map(), points: new Set()}]);
          break;
        }
      }
      if(vertexes.size) {
        break;
      }
    }

    // анализируем вариант T
    for(const [vertex, v] of vertexes) {
      // в ribs живут отрезки, а в points - концы подходящих для сдвига сегментов
      const {skeleton, profile, ribs, points} = v[0];
      const corners = profile.is_corner();
      const candidates = new Set();
      for(const edge of vertex.getEdges()) {
        points.add(edge.endVertex.point);
        if(!ribs.has(edge.profile)) {
          ribs.set(edge.profile, {paths: []});
        }
        const rv = ribs.get(edge.profile);
        rv.paths.push(edge.profile.generatrix.get_subpath(edge.endVertex.point, edge.startVertex.point));
        if(edge.profile.b.is_nearest(vertex.point, true)) {
          rv.node = 'b';
        }
        if(edge.profile.e.is_nearest(vertex.point, true)) {
          rv.node = 'e';
        }

        if(edge.profile !== profile) {
          candidates.add(edge);
        }
      }
      for(const edge of vertex.getEndEdges()) {
        points.add(edge.startVertex.point);
        if(!ribs.has(edge.profile)) {
          ribs.set(edge.profile, {paths: []});
        }
        const rv = ribs.get(edge.profile);
        rv.paths.push(edge.profile.generatrix.get_subpath(edge.startVertex.point, edge.endVertex.point));
        if(edge.profile.b.is_nearest(vertex.point, true)) {
          rv.node = 'b';
        }
        if(edge.profile.e.is_nearest(vertex.point, true)) {
          rv.node = 'e';
        }

        if(edge.profile !== profile) {
          for(const candidate of candidates) {
            if(candidate.profile === edge.profile && !candidate.is_profile_outer(edge)) {
              const base = edge.profile.elm_type.is('Створка') ? edge.profile.rays.outer : edge.profile.generatrix;
              const path = base.get_subpath(edge.startVertex.point, candidate.endVertex.point)
                .elongation(-edge.profile.width);
              point = path.getNearestPoint(point);
              delta = point.subtract(start);
              v[0].point = point;
              break;
            }
          }
        }
      }
      if(v[0].point) {
        break;
      }

      // при любом раскладе, длина исходных сегментов не должна становиться < 0
      for(const [profile, rv] of ribs) {
        const {paths, node} = rv;
        const {width} = profile;
        for(const path of paths) {
          const pt = path.getNearestPoint(point);
          const offset = path.getOffsetOf(pt);
          if(offset < width) {
            point = path.getPointAt(width);
            delta = point.subtract(start);
            v[0].point = point;
            break;
          }
        }
      }

      // угловое соединение
      if(ribs.size <= 2) {
        v[0].point = point;
        points.clear();
        for(const [profile, {node}] of ribs) {
          if(node) {
            const ppoint = node === 'b' ? profile.e : profile.b;
            const {inner, outer} = profile.joined_imposts();
            const imposts = inner.concat(outer);

            if(imposts.length) {
              const ppath = new Path({insert: false, segments: [point, ppoint]});
              for(const impost of imposts) {
                const {b, e} = impost.profile.rays;
                const ipoint = b.profile === profile ? b.point : e.point;
                const i0point = b.profile === profile ? e.point : b.point;
                const gen = impost.profile.generatrix.clone({insert: false})
                let mpoint = ppath.intersect_point(gen, ipoint, true);
                if(!mpoint) {
                  mpoint = ppath.intersect_point(gen.elongation(3000), mpoint, true);
                }
                if(mpoint) {
                  const tv = {skeleton, profile: impost.profile, point: mpoint, ribs: new Map(), points: new Set()};
                  tv.points.add(i0point);
                  tvertexes.set(skeleton.vertexByPoint(i0point), [tv]);
                }
              }
            }
            points.add(ppoint);

          }
        }
      }
      // крест или разрыв
      else {

      }
    }

    for(const [k,v] of tvertexes) {
      vertexes.set(k, v);
    }
    this.draw_move_ribs(vertexes);

    return delta;
  }

  /**
   * Возврвщает Map рёбер с координатами вершин
   * @param start
   * @param point
   * @return {Map}
   */
  snap_shapes({start, point, delta}) {
    const {Path} = this.editor;
    const vertexes = new Map();
    // элементы двигаем перпендикулярно их образующим и следим за вершинами
    // добавляем delta к узлам, строим через них линию, находим точки на примыкающих - они и будут конечными

    // группируем по слоям
    const layers = new Map();
    for (const profile of this.project.selected_profiles()) {
      const {layer} = profile;
      if (!layers.get(layer)) {
        layers.set(layer, []);
      }
      layers.get(layer).push(profile);
    }

    for(const [layer, profiles] of layers) {
      // собираем узлы
      for(const profile of profiles) {
        const {skeleton, b, e, elm_type} = profile;
        // исходные точки
        const vb = skeleton.vertexByPoint(b);
        const ve = skeleton.vertexByPoint(e);
        if(!vertexes.has(vb)) {
          vertexes.set(vb, []);
        }
        if(!vertexes.has(ve)) {
          vertexes.set(ve, []);
        }
        // смещенные точки и линия через них
        const db = b.add(delta);
        const de = e.add(delta);
        // map узлов графа и структуры точек
        vertexes.get(vb).push({skeleton, profile, pt: db, db, de, ribs: new Map(), points: new Set()});
        vertexes.get(ve).push({skeleton, profile, pt: de, db, de, ribs: new Map(), points: new Set()});
      }

      // извлекаем разрешенные диапазоны из шаблона
      const tdelta = delta.clone();
      let li = 200;
      let lmin = 200;
      let lmax = 2000;

      // анализируем вариант T
      for (const [vertex, av] of vertexes) {
        if (!vertex) {
          break;
        }
        // в ribs живут отрезки, а в points - концы подходящих для сдвига сегментов
        for (const v of av) {
          const {skeleton, profile, ribs, points, pt, db, de} = v;
          const candidates = new Set();
          let edges = vertex.getEdges();
          for (const edge of edges) {
            if (!edge.is_some_side(profile, vertex)) {
              continue;
            }

            if (edge.profile.b.is_nearest(vertex.point, true)) {
              ribs.set(edge.profile, 'b');
            }
            if (edge.profile.e.is_nearest(vertex.point, true)) {
              ribs.set(edge.profile, 'e');
            }

            if (edge.profile !== profile) {
              points.add(edge.endVertex.point);
              candidates.add(edge);
            }
          }
          for (const edge of vertex.getEndEdges()) {
            if (!edge.is_some_side(profile, vertex)) {
              continue;
            }

            if (edge.profile.b.is_nearest(vertex.point, true)) {
              ribs.set(edge.profile, 'b');
            }
            if (edge.profile.e.is_nearest(vertex.point, true)) {
              ribs.set(edge.profile, 'e');
            }

            if (edge.profile !== profile) {
              points.add(edge.startVertex.point);
              for (const candidate of candidates) {
                if (candidate.profile === edge.profile && !candidate.is_profile_outer(edge)) {
                  const base = edge.profile.elm_type.is('Створка') ? edge.profile.rays.outer : edge.profile.generatrix;
                  const path = base.get_subpath(edge.startVertex.point, candidate.endVertex.point)
                    .elongation(-edge.profile.width);
                  const line = new Path({insert: false, segments: [db, de]}).elongation(2000);
                  const npoint = line.intersect_point(path, point);
                  if (npoint) {
                    point = npoint;
                  }
                  else {
                    point = path.getNearestPoint(pt);
                  }
                  const offset = path.getOffsetOf(point);
                  if (offset < li) {
                    point = path.getPointAt(li);
                  }
                  else if (offset > (path.length - li)) {
                    point = path.getPointAt(path.length - li);
                  }
                  //delta = point.subtract(start);
                  v.point = point;
                  break;
                }
              }
            }
          }
        }
      }

      // анализируем размеры в лоб
      for(const [vertex, av] of vertexes) {
        for(const v of av) {
          const {skeleton, point, profile, ribs, pt, db, de} = v;
          // если точка найдена в Т - движемся дальше
          if(point) {
            continue;
          }
          // контроль новых размеров и расчёт tdelta
          const lengths = skeleton.getLengths(vertex, delta);
          lengths.forEach(([coordin, [lold, lnew]], index) => {
            const min = index ? li : lmin;
            if(lnew > lmax) {
              if(lold > lmax) {
                tdelta.length = 0;
              }
              else {
                const tmp = lmax - lold;
                if(tdelta.length > tmp) {
                  tdelta.length = tmp;
                }
              }
            }
            else if(lnew < min) {
              if(lold < min) {
                tdelta.length = 0;
              }
              else {
                const tmp = lold - min;
                if(tdelta.length > tmp) {
                  tdelta.length = tmp;
                }
              }
            }
          });

          // вариант простых углов
          if(ribs.size === 2) {
            for(const [other, node] of ribs) {
              if(other !== profile) {
                const base = (other.elm_type.is('Створка') ? other.rays.outer : other.generatrix)
                  .clone({insert: false})
                  .elongation(3000);
                const segments = tdelta.length < delta.length ? [profile.b.add(tdelta), profile.e.add(tdelta)] : [db, de];
                const line = new Path({insert: false, segments}).elongation(2000);
                v.point = line.intersect_point(base, pt);
                break;
              }
            }
          }
          else {
            v.point = tdelta.length < delta.length ? pt.subtract(delta).add(tdelta) : pt;
          }
        }
      }
    }

    this.draw_move_ribs(vertexes);

    return vertexes;
  }

  /**
   * Прячет визуализацию рёбер сдвига
   * @param withOpacity {Boolean}
   */
  hide_move_ribs(withOpacity) {
    const {project, editor} = this;
    for (const contour of project.getItems({class: editor.constructor.Contour})) {
      const {l_visualization} = contour;
      if (l_visualization._move_ribs) {
        l_visualization._move_ribs.removeChildren();
        if (withOpacity) {
          contour.profiles.forEach((profile) => profile.opacity = 1);
          contour.glasses().forEach((glass) => glass.opacity = 1);
        }
      }
    }
  }

  /**
   * Рисует рёбра сдвига
   * @param vertexes {Map}
   */
  draw_move_ribs(vertexes) {
    this.hide_move_ribs();
    const {Path, Group} = this.editor;
    const ppoints = new Map();

    for(const [vertex, v] of vertexes) {
      for(const {skeleton, profile, points, point} of v) {
        const {l_visualization} = skeleton.owner;
        if(!l_visualization) {
          continue;
        }
        if(!l_visualization._move_ribs) {
          l_visualization._move_ribs = new Group({parent: l_visualization});
        }

        if(!ppoints.has(profile)) {
          ppoints.set(profile, {parent: l_visualization._move_ribs, points: []});
        }
        const pp = ppoints.get(profile);
        pp.points.push(point);

        for(const pt of points) {
          new Path({
            parent: l_visualization._move_ribs,
            strokeColor: 'blue',
            strokeWidth: 2,
            strokeScaling: false,
            dashArray: [4, 4],
            guide: true,
            segments: [point, pt],
          });
        }
        new Path.Rectangle({
          parent: l_visualization._move_ribs,
          fillColor: 'blue',
          center: point,
          strokeScaling: false,
          size: [60, 60],
        });

        // прозрачность для деформируемых элементов
        const glasses = skeleton.owner.glasses();
        for(const profile of vertex.profiles) {
          profile.opacity = 0.4;
          profile.joined_glasses(glasses).forEach((glass) => glass.opacity = 0.4);
        }
      }
    }

    for(const [profile, {parent, points}] of ppoints) {
      if(points.length > 1) {
        new Path({
          parent,
          strokeColor: 'blue',
          strokeWidth: 2,
          strokeScaling: false,
          dashArray: [4, 4],
          guide: true,
          segments: [points[0], points[1]],
        });
      }
    }
  }

  /**
   * Двигает рёбра
   * @param vertexes
   */
  move_shapes(vertexes) {
    const {project} = this;
    const move_point = (profile, node_point, d0) => {
      project.deselectAll();
      node_point.selected = true;
      profile.move_points(d0);
      node_point.selected = false;
    };
    // сгруппируем в profiles сдвиги узлов
    const profiles = new Map();
    for(const [vertex, av] of vertexes) {
      for (const v of av) {
        let {ribs, point, pt} = v;
        if(!point) {
          point = pt;
        }
        for(const [profile, node] of ribs) {
          if(!profiles.has(profile)) {
            profiles.set(profile, []);
          }
          const node_point = profile[node];
          if(!node_point.is_nearest(point, 1)) {
            profiles.get(profile).push({node, point});
          }
        }
      }
    }
    for(const [profile, move] of profiles) {
      if(move.length) {
        const {point, node} = move[0];
        const node_point = profile[node];
        const d0 = point.subtract(node_point);
        if(move.length > 1) {
          const d1 = move[1].point.subtract(profile[move[1].node]);
          if(Math.abs(d1.x - d0.x) < 0.5 && Math.abs(d1.y - d0.y) < 0.5) {
            profile.move_gen(d0);
          }
          else {
            move_point(profile, node_point, d0);
            move_point(profile, profile[move[1].node], d1);
          }
          profile._hatching && profile._hatching.removeChildren();
        }
        else {
          if(d0.length) {
            move_point(profile, node_point, d0);
          }
        }
      }
    }
    this.hide_move_ribs(true);
  }
}
