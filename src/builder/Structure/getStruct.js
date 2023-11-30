
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
    const {contours, cnstr} = layer;
    super(layer.presentation(), `l-${cnstr}`, 'icon_layer', layer, parent);
    const setHiddenRecursive = (layer, value) => {
      layer.hidden = value;
      for(const contour of layer.contours) {
        setHiddenRecursive(contour, value);
      }
    };
    Object.defineProperty(this, 'checked', {
      get() {
        return !layer.hidden;
      },
      set(v) {
        setHiddenRecursive(layer, !v);
      }
    });
    for(const layer of contours) {
      this.children.push(new Layer(layer, this));
    }
    this.children.push(new Profiles(layer, this));
    if(layer.cnstr && layer.cnstr !== 1000000) {
      this.children.push(new Glasses(layer, this));
      this.children.push(new Insets(layer, this));
    }
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
  constructor(project) {

    //name, key, icon, _owner, _parent
    super(`Заказ `, 'order', 'icon_order', project);

    const settings = new BaseItem(`Настройки`, 'settings', 'icon_gear', project, this);
    this.children.push(settings);

    this.style = {subtree: {paddingLeft: 0}};

  }

}

export default function getStruct(project) {
  const tree = new Struct(project);
  tree.expand();
  return tree;
}
