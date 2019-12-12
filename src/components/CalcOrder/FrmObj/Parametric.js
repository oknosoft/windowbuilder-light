import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import TabularSection from 'metadata-react/TabularSection';
import ToolbarParametric from './ToolbarParametric';
import CalcOrderAdditions from '../Additions';

class Parametric extends React.Component {

  state = {
    mode: 'tabular'
  };

  setTabular = () => {
    this.setState({mode: 'tabular'});
  };

  setStandart = () => {
    this.setState({mode: 'standart'});
  };

  setExtend = () => {
    this.setState({mode: 'extend'});
  };

  render() {
    const {props: {_obj, height, scheme}, state: {mode}, setStandart, setExtend}  = this;
    if(!scheme) {
      return <Typography key="err-parametric" color="error">
        {`Не найден элемент scheme_settings {obj: "doc.calc_order.production", name: "production.parametric"}`}
      </Typography>;
    }
    if(mode === 'standart') {
      return <CalcOrderAdditions _obj={_obj} handleCancel={this.setTabular}/>;
    }
    if(mode === 'extend') {
      return <Typography key="err-nom" color="error">
        Форма расширенного параметрика пока не подключена
      </Typography>;
    }
    return <div style={{height}}>
      <Typography variant="h6" color="primary">Параметрические изделия</Typography>
      <TabularSection
        _obj={_obj}
        _tabular="production"
        scheme={scheme}
        Toolbar={ToolbarParametric}
        btns={{setStandart, setExtend}}
      />
    </div>;
  }
}

Parametric.propTypes = {
  _obj: PropTypes.object.isRequired,
  height: PropTypes.number,
  scheme: PropTypes.object,
};

export default Parametric;
