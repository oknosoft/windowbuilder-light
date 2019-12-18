// @flow

import React from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';

export default class Builder extends React.Component {

  createEditor(el, width, height){
    if(el) {
      if(this.editor && this.editor._canvas === el) {
        const {project} = this.editor;
        project.resize_canvas(width, height);
      }
      else {
        this.editor = new $p.Editor(el);
        this.props.registerChild(this.editor);
        window.paper = this.editor;
        this.editor.create_tools();
      }
    }
    this.editor && this.props.registerChild(this.editor);
  }

  componentWillUnmount() {
    if(this.editor) {
      this.editor.unload();
      this.props.registerChild(this.editor = null);
      window.paper = null;

    }
  }

  render() {
    const {height, classes} = this.props;
    return <AutoSizer disableHeight>
      {({width}) => {
        if(width < 320) {
          width = 320;
        }
        width -= 8;
        return <canvas
          className={classes.canvas}
          ref={(el) => this.createEditor(el, width, height)}
          width={width}
          height={height}
        />;
      }}
    </AutoSizer>;
  }
}

Builder.propTypes = {
  registerChild: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};
