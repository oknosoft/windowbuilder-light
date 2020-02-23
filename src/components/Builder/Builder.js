// @flow

import React from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import Arrows from './Arrows';

export default class Builder extends React.Component {

  componentWillUnmount() {
    if(this.editor) {
      this.editor.unload();
      this.props.registerChild(this.editor = null);
      window.paper = null;

    }
  }

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

  arrowClick = (btn) => () => {
    if(this.editor && this.editor.tool) {
      this.editor.tool.emit('keydown', {
        key: btn,
        modifiers: {}
      });
    }
  };

  render() {
    const {height, classes} = this.props;
    return <AutoSizer disableHeight>
      {({width}) => {
        if(width < 320) {
          width = 320;
        }
        width -= 8;
        return [
          <canvas
            key="canvas"
            className={classes.canvas}
            ref={(el) => this.createEditor(el, width, height)}
            width={width}
            height={height}
          />,
          <Arrows key="arrows" handleClick={this.arrowClick}/>,
        ];
      }}
    </AutoSizer>;
  }
}

Builder.propTypes = {
  registerChild: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};
