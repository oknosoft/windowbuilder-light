/**
 * ### Диалог редактирования параметрических изделий
 *
 * @module Frame
 *
 * Created by Evgeniy Malyarov on 22.07.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from 'metadata-react/App/Dialog';

import connect from './connect';

class ParametricFrame extends React.Component {

  constructor(props, context) {
    super(props, context);
    const {handleCancel} = props;
    this.handleCancel = handleCancel.bind(this);
    this.state = {msg: null, queryClose: false};
  }

  handleOk = () => {
    this.props.handleCalck.call(this)
      .then(this.handleCancel)
      .catch((err) => {
        this.setState({msg: err.msg || err.message});
      });
  };

  handleCalck = () => {
    this.props.handleCalck.call(this)
      .catch((err) => {
        this.setState({msg: err.msg});
      });
  };

  handleErrClose = () => {
    this.setState({msg: null, queryClose: false});
  };

  queryClose = () => {
    this.setState({queryClose: true});
  };

  render() {

    const {handleCancel, handleErrClose, props: {_obj, Content, classes}, state: {msg, queryClose}} = this;

    return <div className={classes.pr}>
      <Toolbar disableGutters>
        <Button key="ok" onClick={this.handleOk} color="primary">Рассчитать и закрыть</Button>
        <Button key="calck" onClick={this.handleCalck} color="primary">Рассчитать</Button>
        <Button key="cancel" onClick={handleCancel} color="primary">Закрыть</Button>
      </Toolbar>
      <Content ref={(el) => this.additions = el} _obj={_obj}/>
      {msg && <Dialog
        open
        title={msg.title || 'Ошибка при записи'}
        onClose={handleErrClose}
        actions={[
          <Button key="ok" onClick={handleErrClose} color="primary">Ок</Button>,
        ]}
      >
        {msg.obj && <div>{msg.obj.name}</div>}
        {msg.text || msg}
      </Dialog>}
      {queryClose && <Dialog
        open
        title={`Закрыть параметрические изделия?`}
        onClose={handleErrClose}
        actions={[
          <Button key="ok" onClick={handleCancel} color="primary">Ок</Button>,
          <Button key="cancel" onClick={handleErrClose} color="primary">Отмена</Button>
        ]}
      >
        Внесённые изменения будут потеряны
      </Dialog>}
    </div>;

  }
}

ParametricFrame.propTypes = {
  _obj: PropTypes.object,
  classes: PropTypes.object,
  handleCalck: PropTypes.func,
  handleCancel: PropTypes.func,
  Content: PropTypes.func,
};

export default connect(ParametricFrame);
