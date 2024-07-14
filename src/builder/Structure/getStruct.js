
const struct = {
  layers: {
    icon: 'icon_1c_cat'
  },
  params: {
    icon: 'icon_1c_doc'
  },
  inserts: {
    icon: 'icon_1c_enm'
  }
};

class BaseItem {
  constructor(name, key, icon, _owner, _parent) {
    this.key = key;
    this.icon = icon;
    this._owner = _owner;
    this._parent = _parent;
    this.children = [];
    this.name = name || '';
  }

  find_node(owner) {
    if(this._owner === owner) {
      return this;
    }
    for(const node of this.children) {
      const res = node.find_node(owner);
      if(res) {
        return res;
      }
    }
  }

  expand() {
    if(this._parent) {
      this._parent.expand();
    }
    this.toggled = true;
  }

  collaps() {
    this.toggled = false;
    for(const chld of this.children) {
      chld.collaps();
    }
  }

  deselect() {
    this.active = false;
    for(const chld of this.children) {
      chld.deselect();
    }
  }
}

class Layer extends BaseItem {
  constructor(layer, parent) {
    const {contours, index, level} = layer;
    const name = `${level ? 'Створка' : 'Рама'} №${index}`;
    super(name, `l-${index}`, 'icon_layer', layer, parent);
    this.type = 'layer';
    for(const layer of contours) {
      this.children.push(new Layer(layer, this));
    }
    Object.defineProperty(this, 'checked', {
      get() {
        return !layer.hidden;
      },
      set(v) {
        layer.hidden = !v;
      }
    });
    /*
  this.children.push(new Profiles(layer, this));
      if(layer.cnstr && layer.cnstr !== 1000000) {
        this.children.push(new Glasses(layer, this));
        this.children.push(new Insets(layer, this));
      }
    */
  }
  get active() {
    const {_owner} = this;
    const {project} = _owner;
    return project === project._scope.project && _owner === project.activeLayer;
  }
  set active(v) {

  }
}

class Profile extends BaseItem {
  constructor(profile, parent) {
    const {info, elm, segms, addls} = profile;
    super(info, `pr-${elm}`, 'icon_profile', profile, parent);
    for(const item of segms) {
      this.children.push(new Profile(item, this));
    }
    for(const item of addls) {
      this.children.push(new Profile(item, this));
    }
  }
}

class Glass extends BaseItem {
  constructor(glass, parent) {
    const {info, elm} = glass;
    super(info, `gl-${elm}`, 'icon_glass', glass, parent);
  }
}

class SelectableGroup extends BaseItem {
  select(event) {
    const select = [];
    event.type = 'elm';
    const {children, _owner: {project}} = this;
    for(const item of children) {
      select.push({elm: item._owner.elm, node: null, shift: true});
      event.elm = item._owner;
    }
    project._scope.cmd('select', select);
  }
}

class Product extends SelectableGroup {
  constructor(project, index, parent) {
    super(`Изделие №${index+1}`, `root-${index+1}`, 'icon_root', project, parent);
    this.type = 'product';
    for(const layer of project.contours) {
      this.children.push(new Layer(layer, this));
    }
    this.expand();
  }

  get nodeStyle() {
    return {
      activeLink: {
        fontWeight: 500,
        background: 'rgba(128, 128, 128, 0.1)',
      }
    };
  }

  get active() {
    const {_owner} = this;
    return _owner === _owner._scope.project;
  }
  set active(v) {

  }
}

class Profiles extends SelectableGroup {
  constructor(owner, parent) {
    const {cnstr} = owner;
    super('Профили', `pg-${cnstr || 0}`, 'icon_profile', owner, parent);
    for(const item of owner.profiles) {
      this.children.push(new Profile(item, this));
    }
  }
}

class Glasses extends SelectableGroup {
  constructor(owner, parent) {
    const {cnstr} = owner;
    super('Заполнения', `gg-${cnstr || 0}`, 'icon_glass', owner, parent);
    for(const item of owner.glasses(false, true)) {
      this.children.push(new Glass(item, this));
    }
  }
}

class Insets extends BaseItem {
  constructor(owner, parent) {
    const {cnstr, elm} = owner;
    super('Вставки', `ins-${cnstr || 0}`, 'icon_1c_cat', owner, parent);
  }
}

class Struct extends BaseItem {
  constructor(editor) {



    //name, key, icon, _owner, _parent
    //super(`Заказ `, 'order', 'icon_order', project);
    super(`Настройки `, 'settings', 'icon_gear', editor);

    //const settings = new BaseItem(`Настройки`, 'settings', 'icon_gear', project, this);
    //this.children.push(settings);

    editor.projects.forEach((project, index) => {
      this.children.push(new Product(project, index, this));
    });

    this.style = {subtree: {paddingLeft: 0}};
    this.expand();
    //product.expand();

  }
}

export default function getStruct(project) {
  const tree = new Struct(project);
  return tree;
}
