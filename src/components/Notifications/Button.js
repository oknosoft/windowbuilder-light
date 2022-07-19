/**
 * ### Кнопка с колокольчиком и список сообщений
 */

import React from 'react';

import NotificationsIcon from './NotificationsIcon';

export default class NotiButton extends React.Component {

  componentDidMount() {
    if(typeof $p === 'object') {
      $p.ireg.log.on({record: this.onLog});
    }
    else{
      setTimeout(this.componentDidMount.bind(this), 1000);
    }
  }

  componentWillUnmount() {
    $p?.ireg?.log?.off({record: this.onLog});
  }



  onLog = ({count}) => {
    this.setState({count});
  };



  render() {
    let {props: {handleToggle, filter, open, count}, state}  = this;

    const tip = `${count || '0'} непрочитанных сообщений`;
    if(!filter){
      filter = [];
    }
    if(!filter.length || filter[0] === ''){
      filter[0] = 'any';
    }

    return <NotificationsIcon key="noti_button" title={tip} open={open} onClick={handleToggle} count={count}/>
  }
}
