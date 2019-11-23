/**
 * Основной инструмент рисовалки - выделяет элементы
 *
 * @module Tool
 *
 * Created by Evgeniy Malyarov on 28.10.2019.
 */

export default function tool (Editor) {

  const {Tool, Point, PointText, EditableText, Rectangle} = Editor.prototype;
  const {ProfileItem, Filling, DimensionLine, Sectional} = Editor;

  Editor.ToolSelectNode = class ToolSelectNode extends Tool {

    constructor() {

      super();

      Object.assign(this, {
        options: {
          name: 'select_node',
          caption: "Свойства элемента",
        },
        mouseStartPos: new Point(),
        mode: null,
        hitItem: null,
        originalHandleIn: null,
        originalHandleOut: null,
        changed: false,
        minDistance: 10
      });

      this.on({
        mousedown: this.mousedown,
        mouseup: this.mouseup,
        mousemove: this.hitTest,
        keydown: this.keydown,
      });

    }

    // resetHot(type, event, mode) {
    // }

    testHot(type, event, mode) {
      if (mode == 'tool-direct-select'){
        return this.hitTest(event);
      }
    }

    hitTest({point}) {

      const hitSize = 6;
      const {project} = this;
      const canvas_cursor = this._scope.canvas_cursor.bind(this._scope);
      this.hitItem = null;

      if (point) {

        // отдаём предпочтение выделенным ранее элементам
        this.hitItem = project.hitTest(point, {selected: true, fill: true, tolerance: hitSize});

        // во вторую очередь - тем элементам, которые не скрыты
        if (!this.hitItem){
          this.hitItem = project.hitTest(point, {fill: true, visible: true, tolerance: hitSize});
        }

        // Hit test selected handles
        let hit = project.hitTest(point, {selected: true, handles: true, tolerance: hitSize});
        if (hit){
          this.hitItem = hit;
        }

        // Hit test points
        hit = project.hitPoints(point, 16, true);

        if (hit) {
          if (hit.item.parent instanceof ProfileItem) {
            if (hit.item.parent.generatrix === hit.item){
              this.hitItem = hit;
            }
          }
          else{
            this.hitItem = hit;
          }
        }
      }

      const {hitItem} = this;
      if (hitItem) {
        if (hitItem.type == 'fill' || hitItem.type == 'stroke') {
          if (hitItem.item.parent instanceof DimensionLine) {
            // размерные линии сами разберутся со своими курсорами
          }
          else if (hitItem.item instanceof PointText) {
            !(hitItem.item instanceof EditableText) && canvas_cursor('cursor-text');     // указатель с черным Т
          }
          else if (hitItem.item.selected) {
            canvas_cursor('cursor-arrow-small');
          }
          else {
            canvas_cursor('cursor-arrow-white-shape');
          }
        }
        else if (hitItem.type == 'segment' || hitItem.type == 'handle-in' || hitItem.type == 'handle-out') {
          if (hitItem.segment.selected) {
            canvas_cursor('cursor-arrow-small-point');
          }
          else {
            canvas_cursor('cursor-arrow-white-point');
          }
        }
      }
      else {
        // возможно, выделен разрез
        const hit = project.hitTest(point, {stroke: true, visible: true, tolerance: 16});
        if (hit && hit.item.parent instanceof Sectional){
          this.hitItem = hit;
          canvas_cursor('cursor-arrow-white-shape');
        }
        else{
          canvas_cursor('cursor-arrow-white');
        }
      }

      return true;
    }

    get project() {
      return this._scope.project;
    }

    get eve() {
      return this._scope.eve;
    }

    mousedown(event) {
      const {project} = this;
      const {point, modifiers} = event;

      this.mode = null;
      this.changed = false;

      if (this.hitItem && !modifiers.alt) {

        if(this.hitItem.item instanceof PointText) {
          return;
        }

        let item = this.hitItem.item.parent;
        // modifiers.space
        if (item.nearest && item.nearest()) {
          item = item.nearest();
        }

        if (item && (this.hitItem.type == 'fill' || this.hitItem.type == 'stroke')) {

          if (modifiers.shift) {
            item.selected = !item.selected;
          } else {
            project.deselectAll();
            item.selected = true;
          }
          if (item.selected) {
            this.mode = 'move_shapes';
            project.deselect_all_points();
            this.mouseStartPos = point.clone();

            if(item.layer){
              this.eve.emit("layer_activated", item.layer);
            }
          }

        }
        else if (this.hitItem.type == 'segment') {
          if (modifiers.shift) {
            this.hitItem.segment.selected = !this.hitItem.segment.selected;
          } else {
            if (!this.hitItem.segment.selected){
              project.deselect_all_points();
              project.deselectAll();
            }
            this.hitItem.segment.selected = true;
          }
          if (this.hitItem.segment.selected) {
            this.mode = 'move_points';
            this.mouseStartPos = point.clone();
          }
        }
        else if (this.hitItem.type == 'handle-in' || this.hitItem.type == 'handle-out') {
          // this.mode = 'move_handle';
          // this.mouseStartPos = point.clone();
          // this.originalHandleIn = this.hitItem.segment.handleIn.clone();
          // this.originalHandleOut = this.hitItem.segment.handleOut.clone();
        }

        // подключаем диалог свойств элемента
        if(item instanceof ProfileItem || item instanceof Filling){
          //item.attache_wnd(this._scope._acc.elm);
          this.profile = item;
        }

        this._scope.clear_selection_bounds();

      }
      else {
        // Clicked on and empty area, engage box select.
        this.mouseStartPos = point.clone();
        this.mode = 'box-select';

        if(!modifiers.shift && this.profile){
          //this.profile.detache_wnd();
          delete this.profile;
        }

      }
    }

    mouseup(event) {
      const {project} = this;
      const {point, modifiers} = event;

      if(this.changed && ['move_shapes', 'move_points', 'move_handle'].includes(this.mode)) {
        this._scope.clear_selection_bounds();
      }
      else if (this.mode == 'box-select') {

        const box = new Rectangle(this.mouseStartPos, point);

        if (!modifiers.shift){
          project.deselectAll();
        }

        // при зажатом ctrl добавляем элемент иначе - узел
        if (modifiers.control) {
          const profiles = [];
          this._scope.paths_intersecting_rect(box).forEach((path) => {
            if(path.parent instanceof ProfileItem){
              if(profiles.indexOf(path.parent) == -1){
                profiles.push(path.parent);
                path.parent.selected = !path.parent.selected;
              }
            }
            else{
              path.selected = !path.selected;
            }
          });
        }
        else {
          const selectedSegments = this._scope.segments_in_rect(box);
          if (selectedSegments.length > 0) {
            for (let i = 0; i < selectedSegments.length; i++) {
              selectedSegments[i].selected = !selectedSegments[i].selected;
            }
          }
          else {
            const profiles = [];
            this._scope.paths_intersecting_rect(box).forEach((path) => {
              if(path.parent instanceof ProfileItem){
                if(profiles.indexOf(path.parent) == -1){
                  profiles.push(path.parent);
                  path.parent.selected = !path.parent.selected;
                }
              }
              else{
                path.selected = !path.selected;
              }
            });
          }
        }
      }

      this._scope.clear_selection_bounds();

      if (this.hitItem) {
        if (this.hitItem.item.selected || (this.hitItem.item.parent && this.hitItem.item.parent.selected)) {
          this._scope.canvas_cursor('cursor-arrow-small');
        }
        else {
          this._scope.canvas_cursor('cursor-arrow-white-shape');
        }
      }
    }

    keydown(event) {
      const {project} = this;
      const {key, modifiers} = event;
      const step = modifiers.shift ? 1 : 10;
      const profiles = project.selected_profiles();

      if(profiles.length !== 1) {
        return;
      }

      if(['left', 'right', 'up', 'down'].includes(key)) {
        switch (key) {
        case 'left':
          project.move_points(new Point(-step, 0));
          break;
        case 'right':
          project.move_points(new Point(step, 0));
          break;
        case 'up':
          project.move_points(new Point(0, -step));
          break;
        case 'down':
          project.move_points(new Point(0, step));
          break;
        }
        event.event.preventDefault();
        event.event.stopPropagation();
        this._scope.deffered_recalc();
      }

    }
  };

}

