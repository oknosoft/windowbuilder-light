
export default class GridColumn {
  constructor(props) {
    for(const prop in props) {
      if(prop === 'width') {
        if(props.width !== '*') {
          this.width = parseInt(props.width, 10) || 140;
        }
      }
      else if(prop === 'sortable') {
        if(props[prop]) {
          this[prop] = true;
          if(props[prop].direction == 'desc') {
            this.sortDescendingFirst = true;
          }
        }
      }
      else {
        this[prop] = props[prop];
      }
    }
  }

  get _width() {
    return this.width || 200;
  }
}
