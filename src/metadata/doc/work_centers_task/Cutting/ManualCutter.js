import paper from 'paper/dist/paper-core';

class Sheet extends paper.Group {

  constructor(attr) {
    super(attr);
  }

  setup({cuts, currentProduct, currentCut}) {
    this.removeChildren();
    if(currentCut) {
      this.drawSizes(currentCut);
    }
  }

  drawSizes(currentCut) {
    new paper.Path.Rectangle({
      from: [0, 0],
      to: [currentCut.len, currentCut.width],
      parent: this,
      name: 'frame',
      strokeColor: 'black',
      fillColor: new paper.Color(1, 1, 1, 0),
      strokeWidth: 2,
      opacity: 0.8,
      shadowColor: new paper.Color(0, 0, 0, 0.5),
      shadowBlur: 10,
      shadowOffset: new paper.Point(3, 5),
      guide: true,
    });
    const bounds = this.strokeBounds;
    const fontSize = Math.max(bounds.width, bounds.height) / 40;
    const down = new paper.PointText({
      point: bounds.bottomCenter.add([0, fontSize * 1.5]),
      content: currentCut.len,
      fillColor: 'black',
      fontFamily: 'Courier New',
      fontSize,
      justification: 'center',
      guide: true,
    });
    const right = new paper.PointText({
      point: bounds.rightCenter.add([fontSize * 1.2, 0]),
      content: currentCut.width,
      fillColor: 'black',
      fontFamily: 'Courier New',
      fontSize,
      justification: 'center',
      guide: true,
      rotation: -90,
    });
  }

}

export class ManualCutter extends paper.PaperScope {

  constructor({ref, cuts, currentProduct, currentCut}) {
    super();
    this.setup(ref.current);
    ref.project = this.project;
    const {activeLayer} = this.project;
    const sheet = new Sheet({parent: activeLayer, name: 'sheet'});
    sheet.setup({cuts, currentProduct, currentCut});
    this.zoomFit();
  }

  unload() {
    return () => {
      this.project?.remove?.();
      const {_scopes} = paper.PaperScope;
      for(let i in _scopes) {
        if(_scopes[i] === this) {
          delete _scopes[i];
        }
      }
    };
  }

  zoomFit() {
    const bounds = this.project.activeLayer.strokeBounds;

    if (bounds) {
      const space = 40, min = 800;
      let {width, height, center} = bounds;
      if (width < min) {
        width = min;
      }
      if (height < min) {
        height = min;
      }
      width += space;
      height += space;
      const {view} = this;
      const zoom = Math.min(view.viewSize.height / height, view.viewSize.width / width);
      const {scaling} = view._decompose();
      view.scaling = [Math.sign(scaling.x) * zoom, Math.sign(scaling.y) * zoom];

      const dx = view.viewSize.width - width * zoom;
      view.center = center.add([Math.sign(scaling.y) * dx / 2, 20]);
    }
  }

}
