/**
 * ### Добавление (рисование) профилей
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * Created 25.08.2015
 *
 * @module tools
 * @submodule tool_pen
 */

import React from 'react';
const ToolWnd = React.lazy(() => import('../../components/Builder/ToolWnds/PenWnd'));

export default function pen (Editor, {enm, msg, dp, cat, utils}) {

  const {Contour, ProfileItem, Profile, ProfileAddl, ProfileConnective, Sectional, Onlay, Filling, BaseLine} = Editor;
  const {Point, Path} = Object.getPrototypeOf(Editor).prototype;

  /**
   * ### Элементы управления рядом с указателем мыши инструмента `ToolPen`
   *
   * @class PenControls
   * @constructor
   */
  class PenControls {

    constructor(tool) {

      const t = this;
      const _cont = this._cont = document.createElement('div');

      this._tool = tool;
      this.mousemove = this.mousemove.bind(this);
      this.create_click = this.create_click.bind(this);

      function input_change() {
        let p;

        switch(this.name) {

        case 'x':
        case 'y':
          setTimeout(() => {
            tool.emit("mousemove", {
              point: t.point,
              modifiers: {}
            });
          });
          break;

        case 'l':
        case 'a':

          if(!tool.path){
            return false;
          }

          p = new Point();
          p.length = parseFloat(t._l.value || 0);
          p.angle = parseFloat(t._a.value || 0);
          p.y = -p.y;

          t.mousemove({point: tool.point1.add(p)}, true);

          input_change.call({name: "x"});
          break;
        }
      }

      tool.view.element.parentNode.appendChild(_cont);
      _cont.className = "pen_cont";

      tool.project.view.on('mousemove', this.mousemove);

      _cont.innerHTML = "<table><tr><td>x:</td><td><input type='number' name='x' /></td><td>y:</td><td><input type='number' name='y' /></td></tr>" +
        "<tr><td>l:</td><td><input type='number' name='l' /></td><td>α:</td><td><input type='number' name='a' /></td></tr>" +
        "<tr><td colspan='4'><input type='button' name='click' value='Создать точку' /></td></tr></table>";

      this._x = _cont.querySelector("[name=x]");
      this._y = _cont.querySelector("[name=y]");
      this._l = _cont.querySelector("[name=l]");
      this._a = _cont.querySelector("[name=a]");

      this._x.onchange = input_change;
      this._y.onchange = input_change;
      this._l.onchange = input_change;
      this._a.onchange = input_change;

      _cont.querySelector("[name=click]").onclick = this.create_click;

    }

    get point(){
      const {bounds} = this._tool.project,
        x = parseFloat(this._x.value || 0) + (bounds ? bounds.x : 0),
        y = (bounds ? (bounds.height + bounds.y) : 0) - parseFloat(this._y.value || 0);
      return new Point([x, y]);
    }

    blur() {
      const focused = document.activeElement;
      if(focused == this._x) {
        this._x.blur();
      }
      else if(focused == this._y) {
        this._y.blur();
      }
      else if(focused == this._l) {
        this._l.blur();
      }
      else if(focused == this._a) {
        this._a.blur();
      }
    }

    mousemove(event, ignore_pos) {

      const {project: {bounds, view}, profile} = this._tool;

      if(!profile){
        return;
      }

      const pos = ignore_pos || view.projectToView(event.point);

      const {elm_type} = profile;
      if(elm_type == enm.elm_types.Добор || elm_type == enm.elm_types.Соединитель){
        this._cont.style.display = "none";
        return;
      }
      else{
        this._cont.style.display = "";
      }

      if (!ignore_pos) {
        if(pos.x > (view.viewSize.width - 140)) {
          pos.x = view.viewSize.width - 140;
        }
        if(pos.y > (view.viewSize.height - 77)) {
          pos.y = view.viewSize.height - 77;
        }
        this._cont.style.top = pos.y + 16 + "px";
        this._cont.style.left = pos.x - 8 + "px";
      }

      if (bounds) {
        this._x.value = (event.point.x - bounds.x).toFixed(0);
        this._y.value = (bounds.height + bounds.y - event.point.y).toFixed(0);

        if (!ignore_pos) {

          if (this._tool.path) {
            this._l.value = this._tool.point1.getDistance(this.point).round(1);
            const p = this.point.subtract(this._tool.point1);
            p.y = -p.y;
            let angle = p.angle;
            if (angle < 0){
              angle += 360;
            }
            this._a.value = angle.round(1);
          }
          else {
            this._l.value = 0;
            this._a.value = 0;
          }
        }
      }
    }

    create_click() {
      setTimeout(() => {
        this._tool.emit('mousedown', {
          modifiers: {}
        });
        setTimeout(() => {
          this._tool.emit('mouseup', {
            point: this.point,
            modifiers: {}
          });
        });
      });
    }

    unload() {
      const {_scope} = this._tool;
      _scope.project.view.off('mousemove', this.mousemove);
      this._cont.parentNode.removeChild(this._cont);
      this._cont = null;
    }

  }

  /**
   * ### Добавление (рисование) профилей
   *
   * @class ToolPen
   * @extends ToolElement
   * @constructor
   * @menuorder 54
   * @tooltip Рисование
   */
  Editor.ToolPen = class ToolPen extends Editor.ToolElement {

      constructor() {

        super();

        Object.assign(this, {
          options: {
            name: 'pen',
            wnd: {
              caption: 'Рисование профиля',
              bind_generatrix: true,
              bind_node: false,
              inset: '',
              clr: ''
            }
          },
          point1: new Point(),
          last_profile: null,
          mode: null,
          hitItem: null,
          originalContent: null,
          start_binded: false,
          ToolWnd: ToolWnd,
        });

        this.on({
          activate: this.on_activate,
          deactivate: this.on_deactivate,
          mousedown: this.mousedown,
          mouseup: this.on_mouseup,
          mousemove: this.on_mousemove,
          keydown: this.on_keydown,
        });

        this.scheme_changed = this.scheme_changed.bind(this);
        this.layer_activated = this.layer_activated.bind(this);

      }

      // подключает окно редактора
      tool_wnd() {

        // создаём экземпляр обработки
        this.profile = dp.builder_pen.create();

        const {project, profile} = this;
        this.sys = project._dp.sys;

        // восстанавливаем сохранённые параметры
        //wsql.restore_options('editor', this.options);
        this.options.wnd.on_close = this.on_close;

        ['elm_type', 'inset', 'bind_generatrix', 'bind_node'].forEach((prop) => {
          if(prop == 'bind_generatrix' || prop == 'bind_node' || this.options.wnd[prop]) {
            profile[prop] = this.options.wnd[prop];
          }
        });

        // если в текущем слое есть профили, выбираем импост
        if((profile.elm_type.empty() || profile.elm_type == enm.elm_types.Рама) &&
          project.activeLayer instanceof Contour && project.activeLayer.profiles.length) {
          profile.elm_type = enm.elm_types.Импост;
        }
        else if((profile.elm_type.empty() || profile.elm_type == enm.elm_types.Импост) &&
          project.activeLayer instanceof Contour && !project.activeLayer.profiles.length) {
          profile.elm_type = enm.elm_types.Рама;
        }

        // вставку по умолчанию получаем эмулируя событие изменения типа элемента
        dp.builder_pen.emit('value_change', {field: 'elm_type'}, profile);

        // цвет по умолчанию
        profile.clr = project.clr;

        // параметры отбора для выбора вставок
        profile._metadata('inset').choice_links = [{
          name: ['selection', 'ref'],
          path: [(o) => {
            if(utils.is_data_obj(o)){
              return profile.rama_impost.indexOf(o) != -1;
            }
            else{
              let refs = '';
              profile.rama_impost.forEach((o) => {
                if(refs) {
                  refs += ', ';
                }
                refs += `'${o.ref}'`;
              });
              return '_t_.ref in (' + refs + ')';
            }
          }]
        }];

        // дополняем свойства поля цвет отбором по служебным цветам
        cat.clrs.selection_exclude_service(profile._metadata('clr'), this);

      }

      on_activate() {

        super.on_activate('cursor-pen-freehand');

        this._controls = new PenControls(this);

        this.tool_wnd();

        // при активации слоя выделяем его в дереве
        this.eve.on("layer_activated", this.layer_activated);

        // при изменении системы, переоткрываем окно доступных вставок
        this.eve.on("scheme_changed", this.scheme_changed);

        this.decorate_layers();
      }

      layer_activated(contour, virt) {
        const {_attr} = this.project;
        if(!virt && !_attr._loading && !_attr._snapshot){
          this.decorate_layers();
        }
      }

      scheme_changed(scheme) {
        if(this.sys != scheme._dp.sys){
          delete this.profile._metadata('inset').choice_links;
          this.detache_wnd();
          this.tool_wnd();
        }
      }

      on_deactivate() {
        this._scope.clear_selection_bounds();

        this.eve.off("scheme_changed", this.scheme_changed);
        this.eve.off("layer_activated", this.layer_activated);

        this.decorate_layers(true);

        delete this.profile._metadata('inset').choice_links;

        this.detache_wnd();

        if(this.path){
          this.path.removeSegments();
          this.path.remove();
        }
        this.path = null;
        this.last_profile = null;
        this.mode = null;

        this._controls.unload();
      }

      on_keydown(event) {

        // удаление сегмента или элемента
        if(event.key == '-' || event.key == 'delete' || event.key == 'backspace') {

          if(event.event && event.event.target && ['textarea', 'input'].indexOf(event.event.target.tagName.toLowerCase()) != -1) {
            return;
          }

          this.project.selectedItems.forEach((path) => {
            if(path.parent instanceof ProfileItem) {
              path = path.parent;
              path.removeChildren();
              path.remove();
            }
          });

          this.mode = null;
          this.path = null;

          event.stop();
          return false;

        }
        else if(event.key == 'escape') {

          if(this.path) {
            this.path.remove();
            this.path = null;
          }
          this.mode = null;
          this._controls.blur();
        }
      }

      mousedown({event, modifiers}) {
        this.project.deselectAll();

        if(event?.which > 1) {
          return this.on_keydown({key: 'escape'});
        }

        this.last_profile = null;

        if(this.profile.elm_type == enm.elm_types.Добор || this.profile.elm_type == enm.elm_types.Соединитель) {

          // для доборов и соединителей, создаём элемент, если есть addl_hit
          // if(this.addl_hit) {
          //
          // }

        }
        else {

          if(this.mode == 'continue') {
            // для профилей и раскладок, начинаем рисовать
            this.mode = 'create';
            this.start_binded = false;
          }
        }
      }

      on_mouseup({event, modifiers}) {

        this._scope.canvas_cursor('cursor-pen-freehand');

        if(event?.which > 1){
          return this.on_keydown({key: 'escape'});
        }
        else if (this.hitItem?.item && modifiers.alt) {
          this._scope.cmd('deselect', [{elm: null, shift: false}]);
          this._scope.cmd('select', [{elm: -this.hitItem.item.layer.cnstr}]);
          return;
        }

        let whas_select;

        if(this.addl_hit) {

          // рисуем доборный профиль
          if(this.addl_hit.glass && this.profile.elm_type == enm.elm_types.Добор && !this.profile.inset.empty()){
            new ProfileAddl({
              generatrix: this.addl_hit.generatrix,
              proto: this.profile,
              parent: this.addl_hit.profile,
              side: this.addl_hit.side
            });
          }
          // рисуем соединительный профиль
          else if(this.profile.elm_type == enm.elm_types.Соединитель && !this.profile.inset.empty()){
            const connective = new ProfileConnective({
              generatrix: this.addl_hit.generatrix,
              proto: this.profile,
              parent: this.project.l_connective,
            });
            connective.joined_nearests().forEach((rama) => {
              const {inner, outer} = rama.joined_imposts();
              for (const {profile} of inner.concat(outer)) {
                profile.rays.clear();
              }
              /* eslint-disable-next-line */
              for (const {_attr, elm} of rama.joined_nearests()) {
                _attr._rays && _attr._rays.clear();
              }
              const {_attr, layer} = rama;
              _attr._rays && _attr._rays.clear();
              layer && layer.notify && layer.notify({profiles: [rama], points: []}, this._scope.consts.move_points);
            });
          }
        }
        else if(this.mode == 'create' && this.path) {

          if (this.path.length < this._scope.consts.sticking){
            return;
          }

          switch (this.profile.elm_type) {
          case enm.elm_types.Раскладка:
            // находим заполнение под линией
            this.project.activeLayer.glasses(false, true).some((glass) => {
              if(glass.contains(this.path.firstSegment.point) && glass.contains(this.path.lastSegment.point)){
                new Onlay({
                  generatrix: this.path,
                  proto: this.profile,
                  parent: glass
                });
                this.path = null;
                return true;
              }
            });
            break;

          case enm.elm_types.Водоотлив:
            // рисуем разрез
            this.last_profile = new Sectional({generatrix: this.path, proto: this.profile});
            break;

          case enm.elm_types.Линия:
            // рисуем линию
            this.last_profile = new BaseLine({generatrix: this.path, proto: this.profile});
            break;

          default:
            // рисуем профиль
            this.last_profile = new Profile({generatrix: this.path, proto: this.profile});
          }

          this.path = null;
          this.project.redraw();

          if(this.profile.elm_type == enm.elm_types.Рама){
            setTimeout(() => {
              if(this.last_profile){
                this._controls.mousemove({point: this.last_profile.e}, true);
                this.last_profile = null;
                this._controls.create_click();
              }
            }, 50);
          }
        }
        else if (this.hitItem && this.hitItem.item && !modifiers.alt && (modifiers.shift || modifiers.control || modifiers.space)) {

          let item = this.hitItem.item.parent;
          if(modifiers.space && item.nearest && item.nearest()) {
            item = item.nearest();
          }

          if(modifiers.shift) {
            item.selected = !item.selected;
          }
          else {
            this.project.deselectAll();
            item.selected = true;
          }

          // TODO: Выделяем элемент, если он подходящего типа
          if(item instanceof ProfileItem && item.isInserted()) {

            whas_select = true;
            this._controls.blur();
          }
          else if(item instanceof Filling && item.visible) {

            whas_select = true;
            this._controls.blur();
          }

          if(item.selected && item.layer){
            item.layer.activate(true);
          }

        }

        if(!whas_select && !this.mode && !this.addl_hit) {

          this.mode = 'continue';
          this.point1 = this._controls.point;

          if (!this.path){
            this.path = new Path({
              strokeColor: 'black',
              segments: [this.point1]
            });
            this.currentSegment = this.path.segments[0];
            this.originalHandleIn = this.currentSegment.handleIn.clone();
            this.originalHandleOut = this.currentSegment.handleOut.clone();
            this.currentSegment.selected = true;
          }
          this.start_binded = false;
          return;

        }

        if(this.path) {
          this.path.remove();
          this.path = null;
        }
        this.mode = null;
      }

      on_mousemove(event) {

        const {project} = this;

        this.hitTest(event);

        // елси есть addl_hit - рисуем прототип элемента
        if(this.addl_hit){

          if (!this.path){
            this.path = new Path({
              strokeColor: 'black',
              fillColor: 'white',
              strokeScaling: false,
              guide: true
            });
          }

          this.path.removeSegments();

          if(this.addl_hit.glass){
            this.draw_addl();
          }
          else{
            this.draw_connective();
          }
        }
        else if(this.path){

          if(this.mode){

            let delta = event.point.subtract(this.point1),
              dragIn = false,
              dragOut = false,
              invert = false,
              handlePos;

            if (delta.length < this._scope.consts.sticking){
              return;
            }

            if (this.mode == 'create') {
              dragOut = true;
              if (this.currentSegment.index > 0)
                dragIn = true;
            } else  if (this.mode == 'close') {
              dragIn = true;
              invert = true;
            } else  if (this.mode == 'continue') {
              dragOut = true;
            } else if (this.mode == 'adjust') {
              dragOut = true;
            } else  if (this.mode == 'join') {
              dragIn = true;
              invert = true;
            } else  if (this.mode == 'convert') {
              dragIn = true;
              dragOut = true;
            }

            if (dragIn || dragOut) {
              let res, bind = this.profile.bind_node ? "node_" : "";

              if(this.profile.bind_generatrix){
                bind += "generatrix";
              }

              if (invert){
                delta = delta.negate();
              }

              if (dragIn && dragOut) {
                handlePos = this.originalHandleOut.add(delta);
                if(!event.modifiers.shift) {
                  handlePos = handlePos.snap_to_angle();
                }
                this.currentSegment.handleOut = handlePos;
                this.currentSegment.handleIn = handlePos.negate();

              }
              else if (dragOut) {

                // при отжатом shift пытаемся привязать точку к узлам или кратно 45
                let bpoint = this.point1.add(delta);
                if(!event.modifiers.shift) {
                  if(!bpoint.bind_to_nodes(true, project)){
                    bpoint = this.point1.add(delta.snap_to_angle());
                  }
                }

                if(this.path.segments.length > 1){
                  this.path.lastSegment.point = bpoint;
                }
                else{
                  this.path.add(bpoint);
                }

                // попытаемся привязать начало пути к профилям (и или заполнениям - для раскладок) контура
                if(!this.start_binded){

                  if(this.profile.elm_type == enm.elm_types.Раскладка){

                    res = Onlay.prototype.bind_node(this.path.firstSegment.point, project.activeLayer.glasses(false, true));
                    if(res.binded){
                      this.path.firstSegment.point = this.point1 = res.point;
                    }

                  }
                  // привязка к узлам для рамы уже случилась - вяжем для импоста
                  else if(this.profile.elm_type == enm.elm_types.Импост){

                    res = {distance: Infinity};
                    project.activeLayer.profiles.some((element) => {

                      // сначала смотрим на доборы, затем - на сам профиль
                      if(element.children.some((addl) => {
                        if(addl instanceof ProfileAddl && project.check_distance(addl, null, res, this.path.firstSegment.point, bind) === false){
                          this.path.firstSegment.point = this.point1 = res.point;
                          return true;
                        }
                      })){
                        return true;

                      }else if (project.check_distance(element, null, res, this.path.firstSegment.point, bind) === false ){
                        this.path.firstSegment.point = this.point1 = res.point;
                        return true;
                      }
                    });

                    this.start_binded = true;
                  }
                }

                // попытаемся привязать конец пути к профилям (и или заполнениям - для раскладок) контура
                if(this.profile.elm_type == enm.elm_types.Раскладка){

                  res = Onlay.prototype.bind_node(this.path.lastSegment.point, project.activeLayer.glasses(false, true));
                  if(res.binded)
                    this.path.lastSegment.point = res.point;

                }
                else if(this.profile.elm_type == enm.elm_types.Импост){

                  res = {distance: Infinity};
                  project.activeLayer.profiles.some((element) => {

                    // сначала смотрим на доборы, затем - на сам профиль
                    if(element.children.some((addl) => {
                      if(addl instanceof ProfileAddl && project.check_distance(addl, null, res, this.path.lastSegment.point, bind) === false){
                        this.path.lastSegment.point = res.point;
                        return true;
                      }
                    })){
                      return true;

                    }else if (project.check_distance(element, null, res, this.path.lastSegment.point, bind) === false ){
                      this.path.lastSegment.point = res.point;
                      return true;
                    }

                  });
                }

                //this.currentSegment.handleOut = handlePos;
                //this.currentSegment.handleIn = handlePos.normalize(-this.originalHandleIn.length);
              }
              else {
                handlePos = this.originalHandleIn.add(delta);
                if(!event.modifiers.shift) {
                  handlePos = handlePos.snap_to_angle();
                }
                this.currentSegment.handleIn = handlePos;
                this.currentSegment.handleOut = handlePos.normalize(-this.originalHandleOut.length);
              }
              this.path.selected = true;
            }

          }
          else{
            this.path.removeSegments();
            this.path.remove();
            this.path = null;
          }

          if(event.className != "ToolEvent"){
            project.view.update();
          }
        }
      }

      draw_addl() {

        // находим 2 точки на примыкающем профиле и 2 точки на предыдущем и последующем сегментах
        const {profiles} = this.addl_hit.glass;
        const prev = this.addl_hit.rib==0 ? profiles[profiles.length-1] : profiles[this.addl_hit.rib-1];
        const curr = profiles[this.addl_hit.rib];
        const next = this.addl_hit.rib==profiles.length-1 ? profiles[0] : profiles[this.addl_hit.rib+1];

        const path_prev = prev.outer ? prev.profile.rays.outer : prev.profile.rays.inner;
        const path_curr = curr.outer ? curr.profile.rays.outer : curr.profile.rays.inner;
        const path_next = next.outer ? next.profile.rays.outer : next.profile.rays.inner;

        let p1 = path_curr.intersect_point(path_prev, curr.b),
          p2 = path_curr.intersect_point(path_next, curr.e),
          sub_path = path_curr.get_subpath(p1, p2);

        // рисуем внешнюю часть прототипа пути доборного профиля
        this.path.addSegments(sub_path.segments);

        // завершим рисование прототипа пути доборного профиля
        sub_path = sub_path.equidistant(-(this.profile.inset.nom().width || 20));
        sub_path.reverse();
        this.path.addSegments(sub_path.segments);
        sub_path.removeSegments();
        sub_path.remove();
        this.path.closePath();

        // получаем generatrix
        if(!this.addl_hit.generatrix){
          this.addl_hit.generatrix = new Path({insert: false});
        }
        p1 = prev.profile.generatrix.getNearestPoint(p1);
        p2 = next.profile.generatrix.getNearestPoint(p2);
        this.addl_hit.generatrix.removeSegments();
        this.addl_hit.generatrix.addSegments(path_curr.get_subpath(p1, p2).segments);

      }

      draw_connective() {

        const {rays, b, e} = this.addl_hit.profile;

        let sub_path = rays.outer.get_subpath(b, e);

        // получаем generatrix
        if(!this.addl_hit.generatrix){
          this.addl_hit.generatrix = new Path({insert: false});
        }
        this.addl_hit.generatrix.removeSegments();
        this.addl_hit.generatrix.addSegments(sub_path.segments);

        // рисуем внутреннюю часть прототипа пути доборного профиля
        this.path.addSegments(sub_path.equidistant(this.profile.inset.nom().width / 2 || 10).segments);

        // завершим рисование прототипа пути доборного профиля
        sub_path = sub_path.equidistant(-(this.profile.inset.nom().width || 10));
        sub_path.reverse();
        this.path.addSegments(sub_path.segments);
        sub_path.removeSegments();
        sub_path.remove();
        this.path.closePath();

      }

      hitTest_addl(event) {

        const hitSize = 16;
        const {project, _scope} = this;

        if (event.point){
          this.hitItem = project.hitTest(event.point, { stroke:true, curves:true, tolerance: hitSize });
        }

        if (this.hitItem) {

          if(this.hitItem.item.layer == project.activeLayer &&
              this.hitItem.item.parent instanceof ProfileItem && !(this.hitItem.item.parent instanceof Onlay)){
            // для профиля, определяем внешнюю или внутреннюю сторону и ближайшее примыкание

            const hit = {
              point: this.hitItem.point,
              profile: this.hitItem.item.parent
            };

            // выясним, с какой стороны примыкает профиль
            if(hit.profile.rays.inner.getNearestPoint(event.point).getDistance(event.point, true) <
              hit.profile.rays.outer.getNearestPoint(event.point).getDistance(event.point, true)){
              hit.side = "inner";
            }
            else{
              hit.side = "outer";
            }

            // бежим по всем заполнениям и находим ребро
            hit.profile.layer.glasses(false, true).some((glass) => {
              return glass.profiles.some((rib, index) => {
                if(rib.profile == hit.profile && rib.sub_path && rib.sub_path.getNearestPoint(hit.point).is_nearest(hit.point, true)){
                  if(hit.side == "outer" && rib.outer || hit.side == "inner" && !rib.outer){
                    hit.rib = index;
                    hit.glass = glass;
                    return true;
                  }
                }
              });

            });

            if(hit.glass){
              this.addl_hit = hit;
              _scope.canvas_cursor('cursor-pen-adjust');
            }

          }
          else if(this.hitItem.item.parent instanceof Filling){
            // для заполнения, ищем ребро и примыкающий профиль

            // this.addl_hit = this.hitItem;
            // _scope.canvas_cursor('cursor-pen-adjust');

          }else{
            _scope.canvas_cursor('cursor-pen-freehand');
          }

        } else {

          this.hitItem = project.hitTest(event.point, { fill:true, visible: true, tolerance: hitSize  });
          _scope.canvas_cursor('cursor-pen-freehand');
        }

      }

      hitTest_connective(event) {

        const hitSize = 16;
        const {project, _scope} = this;
        const rootLayer = project.rootLayer();

        if (event.point){
          this.hitItem = rootLayer.hitTest(event.point, { stroke:true, curves:true, tolerance: hitSize });
        }

        if (this.hitItem) {

          if(this.hitItem.item.parent instanceof ProfileItem && !(this.hitItem.item.parent instanceof Onlay)){
            // для профиля, определяем внешнюю или внутреннюю сторону и ближайшее примыкание

            const hit = {
              point: this.hitItem.point,
              profile: this.hitItem.item.parent
            };

            // выясним, с какой стороны примыкает профиль
            if(hit.profile.rays.inner.getNearestPoint(event.point).getDistance(event.point, true) <
              hit.profile.rays.outer.getNearestPoint(event.point).getDistance(event.point, true)){
              hit.side = "inner";
            }
            else{
              hit.side = "outer";
            }

            // для соединителей, нас интересуют только внешние рёбра
            if(hit.side == "outer"){
              this.addl_hit = hit;
              _scope.canvas_cursor('cursor-pen-adjust');
            }

          }
          else{
            _scope.canvas_cursor('cursor-pen-freehand');
          }

        }
        else {
          this.hitItem = project.hitTest(event.point, { fill:true, visible: true, tolerance: hitSize  });
          _scope.canvas_cursor('cursor-pen-freehand');
        }
      }

      hitTest(event) {

        this.addl_hit = null;
        this.hitItem = null;

        if(this.profile.elm_type == enm.elm_types.Добор){
          this.hitTest_addl(event);
        }
        else if(this.profile.elm_type == enm.elm_types.Соединитель){
          this.hitTest_connective(event);
        }
        else{

          const hitSize = 6;

          if (event.point){
            this.hitItem = this.project.hitTest(event.point, { fill:true, stroke:true, selected: true, tolerance: hitSize });
          }

          if(!this.hitItem){
            this.hitItem = this.project.hitTest(event.point, { fill:true, visible: true, tolerance: hitSize  });
          }

          if (this.hitItem && this.hitItem.item.parent instanceof ProfileItem
            && (this.hitItem.type == 'fill' || this.hitItem.type == 'stroke')) {
            this._scope.canvas_cursor('cursor-pen-adjust');
          }
          else {
            this._scope.canvas_cursor('cursor-pen-freehand');
          }
        }

        return true;
      }



      /**
       * ### Добавление типовой формы
       *
       * @param [name] {String} - имя типовой формы
       */
      standard_form(name) {
        if(this['add_' + name]) {
          this['add_' + name](this.project.bounds);
          this.project.zoom_fit();
        }
        else {
          name !== 'standard_form' && msg.show_not_implemented();
        }
      }

      /**
       * ### Добавляет последовательность профилей
       * @param points {Array}
       */
      add_sequence(points) {
        const profiles = [];
        points.forEach((segments) => {
          profiles.push(new Profile({
            generatrix: new Path({
              strokeColor: 'black',
              segments: segments
            }), proto: this.profile
          }));
        });
        this.project.activeLayer.on_sys_changed(true);
        return profiles;
      }

      /**
       * Рисует квадрат
       * @param bounds
       */
      add_square(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([0, -1000])],
          [point.add([0, -1000]), point.add([1000, -1000])],
          [point.add([1000, -1000]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует triangle1
       * @param bounds
       */
      add_triangle1(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([0, -1000])],
          [point.add([0, -1000]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует triangle2
       * @param bounds
       */
      add_triangle2(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([1000, -1000])],
          [point.add([1000, -1000]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует triangle3
       * @param bounds
       */
      add_triangle3(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([500, -500])],
          [point.add([500, -500]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует semicircle1
       * @param bounds
       */
      add_semicircle1(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        const profiles = this.add_sequence([
          [point, point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
        profiles[0].arc_h = 500;
      }

      /**
       * Рисует semicircle2
       * @param bounds
       */
      add_semicircle2(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        const profiles = this.add_sequence([
          [point, point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
        profiles[1].arc_h = 500;
      }

      /**
       * Рисует circle
       * @param bounds
       */
      add_circle(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        const profiles = this.add_sequence([
          [point, point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
        profiles[0].arc_h = 500;
        profiles[1].arc_h = 500;
      }

      /**
       * Рисует arc1
       * @param bounds
       */
      add_arc1(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        const profiles = this.add_sequence([
          [point, point.add([0, -500])],
          [point.add([0, -500]), point.add([1000, -500])],
          [point.add([1000, -500]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
        profiles[1].arc_h = 500;
      }

      /**
       * Рисует trapeze1
       * @param bounds
       */
      add_trapeze1(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([0, -500])],
          [point.add([0, -500]), point.add([500, -1000])],
          [point.add([500, -1000]), point.add([1000, -500])],
          [point.add([1000, -500]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует trapeze2
       * @param bounds
       */
      add_trapeze2(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([0, -750])],
          [point.add([0, -750]), point.add([250, -1000])],
          [point.add([250, -1000]), point.add([750, -1000])],
          [point.add([750, -1000]), point.add([1000, -750])],
          [point.add([1000, -750]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует trapeze3
       * @param bounds
       */
      add_trapeze3(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([0, -1000])],
          [point.add([0, -1000]), point.add([500, -1000])],
          [point.add([500, -1000]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует trapeze4
       * @param bounds
       */
      add_trapeze4(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([500, -1000])],
          [point.add([500, -1000]), point.add([1000, -1000])],
          [point.add([1000, -1000]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует trapeze5
       * @param bounds
       */
      add_trapeze5(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([0, -1000])],
          [point.add([0, -1000]), point.add([1000, -500])],
          [point.add([1000, -500]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует trapeze6
       * @param bounds
       */
      add_trapeze6(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([0, -500])],
          [point.add([0, -500]), point.add([1000, -1000])],
          [point.add([1000, -1000]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует trapeze7
       * @param bounds
       */
      add_trapeze7(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([0, -500])],
          [point.add([0, -500]), point.add([500, -1000])],
          [point.add([500, -1000]), point.add([1000, -1000])],
          [point.add([1000, -1000]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует trapeze8
       * @param bounds
       */
      add_trapeze8(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([0, -1000])],
          [point.add([0, -1000]), point.add([500, -1000])],
          [point.add([500, -1000]), point.add([1000, -500])],
          [point.add([1000, -500]), point.add([1000, 0])],
          [point.add([1000, 0]), point]
        ]);
      }

      /**
       * Рисует trapeze9
       * @param bounds
       */
      add_trapeze9(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point.add([0, -500]), point.add([0, -1000])],
          [point.add([0, -1000]), point.add([1000, -1000])],
          [point.add([1000, -1000]), point.add([1000, 0])],
          [point.add([1000, 0]), point.add([500, 0])],
          [point.add([500, 0]), point.add([0, -500])]
        ]);
      }

      /**
       * Рисует trapeze10
       * @param bounds
       */
      add_trapeze10(bounds) {
        // находим правую нижнюю точку
        const point = bounds.bottomRight;
        this.add_sequence([
          [point, point.add([0, -1000])],
          [point.add([0, -1000]), point.add([1000, -1000])],
          [point.add([1000, -1000]), point.add([1000, -500])],
          [point.add([1000, -500]), point.add([500, 0])],
          [point.add([500, 0]), point]
        ]);
      }

      /**
       * Делает полупрозрачными элементы неактивных контуров
       * @param reset
       */
      decorate_layers(reset) {
        const {activeLayer} = this.project;
        this.project.getItems({class: Contour}).forEach((l) => {
          l.opacity = (l == activeLayer || reset) ? 1 : 0.5;
        });
      }

    };

}



