/**
 * Доп. вставки в изделие, слой, элемент
 *
 * @module DopInsets
 *
 * Created by Evgeniy Malyarov on 13.02.2020.
 */

import React from 'react';
import PropTypes from 'prop-types';
import TabularSection from 'metadata-react/TabularSection';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/DeleteOutline';
import InsetsProps from './DopInsetsProps';

class DopInsets extends React.Component {

  constructor(props, context) {
    super(props, context);
    const {cat, utils} = $p;
    this._meta = utils._clone(cat.characteristics.metadata('inserts'));
    // this._meta.fields.w.type.fraction = 0;
    // this._meta.fields.h.type.fraction = 0;

    cat.scheme_settings.find_rows({obj: 'cat.characteristics.inserts'}, (scheme) => {
      if(scheme.name.endsWith('dop')) {
        this.scheme = scheme;
      }
    });
  }

  filter = (collection) => {
    const res = [];
    const {cnstr} = this.props;
    collection.forEach((row) => {
      if(row.cnstr === cnstr) {
        res.push(row);
      }
    });
    return res;
  };

  defferedUpdate = () => {
    setTimeout(() => {
      const {editor} = this.props;
      editor && editor.project && editor.project.register_change();
      this.forceUpdate();
    }, 300);
  };

  handleAdd = () => {
    const {ox, cnstr} = this.props;
    const row = ox.inserts.add({cnstr});
    this.defferedUpdate();
  };

  handleRemove = () => {
    this._grid.handleRemove();
    this.defferedUpdate();
  };

  handleRef = (el) => {
    this._grid = el;
  };

  btns() {
    return [
      <IconButton key="btn_add" title="Добавить вставку" onClick={this.handleAdd}><AddIcon /></IconButton>,
      <IconButton key="btn_del" title="Удалить строку" onClick={this.handleRemove}><RemoveIcon /></IconButton>,
    ];
  }

  render() {
    const {_grid, props: {ox, cnstr, kind}} = this;
    const minHeight = 140;
    const row = _grid && _grid.state.selected && _grid.state.selected.hasOwnProperty('rowIdx') && _grid.rowGetter(_grid.state.selected.rowIdx);

    return this.scheme ?
      <div>
        <Typography>{`Доп. вставки в ${kind}${cnstr ? ` №${cnstr}` : ''}`}</Typography>
        <div style={{height: minHeight}}>
          <TabularSection
            ref={this.handleRef}
            _obj={ox}
            _meta={this._meta}
            _tabular="inserts"
            scheme={this.scheme}
            filter={this.filter}
            minHeight={minHeight}
            denyAddDel
            denyReorder
            btns={this.btns()}
            //onCellSelected={this.defferedUpdate}
            onRowUpdated={this.defferedUpdate}
          />
        </div>
        <InsetsProps ox={ox} cnstr={cnstr} inset={row ? row.inset : {}}/>
      </div>
      :
      <Typography color="error">
        {`Не найден элемент scheme_settings {obj: "cat.characteristics.inserts", name: "cat.characteristics.inserts.dop"}`}
      </Typography>;
  }

}

DopInsets.propTypes = {
  ox: PropTypes.object.isRequired,
  cnstr: PropTypes.number.isRequired,
};

export default DopInsets;
