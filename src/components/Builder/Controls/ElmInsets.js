/**
 * Вставки в элемент
 *
 * Created by Evgeniy Malyarov on 25.08.2021.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import TabularSection from 'metadata-react/TabularSection';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Bar from './Bar';
import ElmInsetProps from './ElmInsetProps';
import RegionEditor from './ElmInsetRegion';

export default class ElmInsets extends React.Component {

  constructor(props, context) {
    super(props, context);

    $p.cat.scheme_settings.find_rows({obj: 'cat.characteristics.inserts'}, (scheme) => {
      if(!this.scheme || scheme.name.endsWith('main')) {
        this.scheme = scheme;
      }
    });
    this.state = {row: null, inset: null};
    this.tune_meta(props.elm);
  }

  shouldComponentUpdate(nextProps) {
    if(nextProps.elm !== this.props.elm) {
      this.tune_meta(nextProps.elm);
    }
    return true;
  }

  tune_meta(elm) {
    const {cat, utils} = $p;
    this._meta = utils._clone(cat.characteristics.metadata('inserts'));
    const {inserts} = (elm).inset;
    this._meta.fields.inset.choice_params = inserts.count() ?
      [{name: 'ref', path: inserts.unload_column('inset')}] : [];
  }

  filter = (collection) => {
    const {elm} = this.props.elm;
    const res = [];
    collection.find_rows({cnstr: -elm}, (row) => {
      res.push(row);
    });
    return res;
  };

  defferedUpdate = () => {
    setTimeout(() => {
      this._grid && this._grid.forceUpdate();
    }, 100);
  };

  handleAdd = () => {
    const {ox, elm, inset} = this.props.elm;
    $p.ui.dialogs.input_value({
      title: 'Укажите вставку',
      list: inset.inserts.unload_column('inset'),
    })
      .then((inset) => {
        const row = ox.inserts.add({cnstr: -elm, inset});
        return row;
      })
      .then((row) => {
        if(this._grid) {
          this._grid.cache_actual = false;
        }
        this.setState({row, inset: row.inset});
      });
  };

  handleRemove = () => {
    this._grid.handleRemove();
    this.setState({row: null, inset: null});
  };

  handleRef = (el) => {
    this._grid = el;
  };

  handleCellSelected = (sel, row) => {
    if(!row && sel && sel.hasOwnProperty('rowIdx')) {
      row = this._grid.rowGetter(sel.rowIdx);
    }
    this.setState({row, inset: (!row || row.inset.empty()) ? null : row.inset});
  };

  // установим для колонки "Ряд", индивидуальный элемент управления
  handleColumnsChange = ({scheme, columns}) => { /* eslint-disable-line */
    const region = columns.find(({key}) => key === 'region');
    if(region) {
      region.editor = RegionEditor;
    }
  };


  render() {

    const {props: {elm}, state: {row, inset}} = this;

    if(!elm.inset.inserts.count()) {
      return null;
    }

    return <>
      <Bar>Вложенные вставки</Bar>
      <Toolbar disableGutters variant="dense">
        <IconButton key="btn_add" title="Добавить вставку" onClick={this.handleAdd}><AddIcon /></IconButton>
        <IconButton key="btn_del" title="Удалить строку" onClick={this.handleRemove}><RemoveIcon /></IconButton>
      </Toolbar>
      {this.scheme ? <>
          <div style={{height: 110}}>
            <TabularSection
              ref={this.handleRef}
              _obj={elm.ox}
              _meta={this._meta}
              _tabular="inserts"
              scheme={this.scheme}
              filter={this.filter}
              disable_cache
              minHeight={110}
              hideToolbar
              denyReorder
              onCellSelected={this.handleCellSelected}
              columnsChange={this.handleColumnsChange}
              //onRowUpdated={this.defferedUpdate}
            />
          </div>
          <ElmInsetProps elm={elm} inset={inset} row={row}/>
        </>
        :
        <Typography color="error">
          {`Не найден элемент scheme_settings {obj: "cat.characteristics.inserts", name: "inserts.main"}`}
        </Typography>}
    </>;
  }
}

ElmInsets.propTypes = {
  elm: PropTypes.object.isRequired,
};
