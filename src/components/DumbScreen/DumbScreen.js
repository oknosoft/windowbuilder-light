import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {FrmLogin} from 'metadata-react/FrmLogin/Proxy/FrmLogin';  // логин и свойства подключения
import loginStyles from 'metadata-react/FrmLogin/Proxy/styles';
const Login = loginStyles(FrmLogin);

import Repl from './Repl';

function handleLogin(login, password) {
  return $p.adapters.pouch.log_in(login, password);
}

function text({meta_loaded, common_loaded, complete_loaded, user}) {
  let text;
  if(!meta_loaded) {
    text = 'Загрузка модулей...';
  }
  else if(!common_loaded) {
    text = 'Чтение общих данных...';
  }
  else if(!user.logged_in) {
    text = 'Проверка подлинности пользователя...';
  }
  else if(!complete_loaded) {
    text = 'Чтение справочников...';
  }
  else {
    text = 'Подготовка...';
  }
  return text;
}

class DumbScreen extends Component {

  renderRepl(footer) {
    const res = [<Repl key="ram" info={{text: ''}}/>];
    footer && res.push(<div key="footer">{footer}</div>);
    return res;
  }

  render() {

    let {page, top, repl, meta_loaded, common_loaded, user, complete_loaded} = this.props;
    let need_auth = meta_loaded && common_loaded && !user.try_log_in && !user.logged_in;
    if(need_auth && complete_loaded) {
      const {current_user} = $p;
      if(current_user && current_user.name == user.name) {
        need_auth = false;
      }
    }
    const over = page && page.limit * page.page > page.total_rows;

    let title;
    if(repl && repl.root) {
      title = repl.root.title;
    }
    if(!title) {
      title = text(this.props);
    }

    const footer = (page && page.total_rows) ? (over ?
      <div>{`Такт №${page.page}, загружено ${page.total_rows} объектов - чтение изменений `} <i className="fa fa-spinner fa-pulse"></i></div>
      :
      page.text || `Такт №${page.page}, загружено ${page.docs_written} из ${page.total_rows} объектов`)
      : '';

    return need_auth ?
      <Login {...this.props} handleLogin={handleLogin}/> :
      <div className='splash' style={{marginTop: top}}>
        <div className="description">
          <h1 key="name" itemProp="name">Заказ дилера</h1>
          <p key="category">Категория: <span itemProp="applicationSubCategory">CRM, CAD, E-Commerce</span></p>
          <p key="platform">Платформа: <i className="fa fa-chrome" aria-hidden="true"></i> браузер Chrome для <span
            itemProp="operatingSystem">Windows 8, 10 | Android | Mac | iOS</span>
          </p>
          <div key="description" itemProp="description">
            <p>Веб-сервис <a href="https://business-programming.ru/articles/implementation_of_the_windowbuilder"
                             title="Программы для оконных заводов и дилеров"
                             target="_blank" rel="noopener noreferrer">Заказ дилера</a>, предназначен для:</p>
            <ul>
              <li>Расчета геометрии, спецификации и стоимости оконных и витражных конструкций (ПВХ, Дерево, Алюминий)</li>
              <li>Aвтоматизации работы менеджеров и дилеров</li>
              <li>Ускорения и упрощения подготовки производства</li>
              <li>Планирования и контроля на всех этапах</li>
            </ul>
          </div>
      </div>

      <div style={{paddingTop: '30px'}}>
        <div>{title}</div>
        {this.renderRepl(page && footer)}
      </div>

    </div>;
  }
}

DumbScreen.propTypes = {
  step: PropTypes.number,
  step_size: PropTypes.number,
  count_all: PropTypes.number,
  top: PropTypes.number,
  title: PropTypes.string,
  processed: PropTypes.string,
  current: PropTypes.string,
  bottom: PropTypes.string,
  page: PropTypes.object,
  repl: PropTypes.object,
};

export default DumbScreen;
