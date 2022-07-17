/**
 * Плдключает сообщения пользователю
 */

export default function connect(Superclass) {
  return class extends Superclass {

    constructor(props, context) {
      super(props, context);
      this.state.noti = {
        open: false,
        count: 0,
        filter: ['any'],
        handleToggle: this.handleToggle.bind(this),
        filterChange: this.filterChange.bind(this),
        mark_viewed: this.mark_viewed.bind(this),
        clear_log: this.clear_log.bind(this),
      };
    }

    handleToggle() {
      const {noti} = this.state;
      this.setState({noti: Object.assign({}, noti, {open: !noti.open})});
    }

    mark_viewed() {
      $p.ireg.log.mark_viewed();
      this.setState({count: 0});
    }

    clear_log() {
      $p.ireg.log.clear();
      this.setState({count: 0});
    }

    filterChange({target: {value}}) {
      if(!value.length || !value[0]) {
        value[0] = 'any';
      }
      const any = value.indexOf('any');
      if(any != -1) {
        if(value.indexOf('error') != -1 || value.indexOf('alert') != -1 || value.indexOf('note') != -1) {
          value.splice(any, 1);
        }
      }
      this.setState({noti: Object.assign({}, this.state.noti, {filter: value})});
    }

    filterLog(filter) {
      return $p.ireg.log.viewed().filter((row) => {
        if(filter.includes('new') && row.key) {
          return false;
        }
        return filter.includes('any') || filter.includes(row.class);
      });
    }

    coordinates_calculated = (project, attr) => {
      // проверяем ошибки в спецификации
      const {ОшибкаКритическая, ОшибкаИнфо} = $p.enm.elm_types;
      const {BuilderElement} = project._scope.constructor;
      const rows = [];
      const set = new Set();
      const {noti} = this.state;
      project.ox.specification.forEach((row) => {
        const {nom} = row;
        if([ОшибкаКритическая, ОшибкаИнфо].includes(nom.elm_type)) {
          const {elm, characteristic, origin} = row;
          const element = project.getItem({class: BuilderElement, elm});
          rows.push({
            element,
            note: `${element ? element.elm_type.toString() + ` №${elm}:` : origin.toString()} ${nom.name}`,
            class: nom.elm_type === ОшибкаКритическая ? 'error' : 'info'});
          set.add(nom);
        }
      });
      if(noti.count !== set.size || rows.length || noti?.rows?.length) {
        this.setState({noti: Object.assign({}, noti, {count: set.size, rows})});
      }
    };

  };
}
