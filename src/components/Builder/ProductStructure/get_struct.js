
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
    if(contours.length) {
      this.children.push(new Layers(layer, this));
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
    const {info, elm} = profile;
    super(info, `pr-${elm}`, 'icon_profile', profile, parent);
  }
}

class Glass extends BaseItem {
  constructor(glass, parent) {
    const {info, elm} = glass;
    super(info, `gl-${elm}`, 'icon_glass', glass, parent);
  }
}

class Layers extends BaseItem {
  constructor(owner, parent) {
    const {cnstr} = owner;
    super('Слои', `lg-${cnstr || 0}`, 'icon_layers', owner, parent);
    for(const layer of owner.contours) {
      this.children.push(new Layer(layer, this));
    }
  }
}

class Profiles extends BaseItem {
  constructor(owner, parent) {
    const {cnstr} = owner;
    super('Профили', `pg-${cnstr || 0}`, 'icon_profile', owner, parent);
    for(const item of owner.profiles) {
      this.children.push(new Profile(item, this));
    }
  }
}

class Glasses extends BaseItem {
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
    // for(const item of owner.glasses(false, true)) {
    //   this.children.push(new Glass(item, this));
    // }
  }
}

class Struct extends BaseItem {
  constructor(project) {
    const {ox, contours, l_connective} = project;
    super(ox.prod_name(true), 'root', 'icon_root', project);

    //this.children.push(new Layers(project, this));

    for(const layer of contours) {
      this.children.push(new Layer(layer, this));
    }
    this.children.push(new Layer(l_connective, this));

    this.children.push(new Insets(project, this));

    this.toggled = true;
  }



}

export default function get_struct(project) {
  const tree = new Struct(project);
  return tree;
}
