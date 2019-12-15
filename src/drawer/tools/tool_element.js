
export default function tool_element (Editor) {

  const {Tool} = Editor.prototype;

  /**
   * ### Виртуальный инструмент - прототип для инструментов _select_node_ и _select_elm_
   *
   * @class ToolElement
   * @extends paper.Tool
   * @constructor
   */
  Editor.ToolElement = class ToolElement extends Tool {

    /* eslint-disable-next-line */
    resetHot(type, event, mode) {

    }

    /* eslint-disable-next-line */
    testHot(type, event, mode) {
      return this.hitTest(event);
    }

    /**
     * ### Отключает и выгружает из памяти окно свойств инструмента
     *
     * @method detache_wnd
     * @for ToolElement
     * @param tool
     */
    detache_wnd() {
      this.profile = null;
    }

    /**
     * ### Проверяет, есть ли в проекте слои, при необходимости добавляет
     * @method detache_wnd
     * @for ToolElement
     */
    check_layer() {
      const {project, eve} = this._scope;
      if (!project.contours.length) {
        // создаём пустой новый слой
        new Editor.Contour({parent: undefined});
        // оповещаем мир о новых слоях
        eve.emit_async('rows', project.ox, {constructions: true});
      }
    }

    /**
     * ### Общие действия при активизации инструмента
     *
     * @method on_activate
     * @for ToolElement
     */
    on_activate(cursor) {

      //this._scope.tb_left.select(this.options.name);

      this._scope.canvas_cursor(cursor);

      // для всех инструментов, кроме select_node...
      if (this.options.name != "select_node") {

        this.check_layer();

        // проверяем заполненность системы
        if (this.project._dp.sys.empty()) {
          $p.msg.show_msg({
            type: "alert-warning",
            text: $p.msg.bld_not_sys,
            title: $p.msg.bld_title
          });
        }
      }
    }

    get eve() {
      return this._scope.eve;
    }

    get project() {
      return this._scope.project;
    }

  };

}



