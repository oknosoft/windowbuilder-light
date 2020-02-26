import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Orders from './Orders'

class Additions extends React.Component {

  constructor(props, context) {
    super(props, context);
    const {orders} = props._obj;
    this.state = {
      orders_row: null,
      order_row: null,
      prm_row: null,
      invoice: null,
    };
  }

  componentDidMount() {
    const {orders} = this.props._obj;
    if(orders.count()) {
      this.set_row('orders')(orders.get(0));
    }
  }

  set_order(row) {
    row && Promise.resolve()
      .then(() => {
        if(row.invoice.empty()) {
          const {doc, current_user: responsible} = $p;
          const {organization, department} = this.props._obj;
          return doc.purchase_order.create({responsible, organization, department});
        }
        else if(row.invoice.is_new()) {
          return row.invoice.load();
        }
      })
      .then((invoice) => {
        row.invoice = invoice;
        const state = {invoice};
        if(invoice.goods.count()) {
          state.order_row = invoice.goods.get(0);
        }
        this.setState(state);
      });
  }

  set_row = (name) => (row) => {
    this.setState({[`${name}_row`]: row});
    if(name === 'orders') {
      this.set_order(row);
    }
  };

  render() {
    const {props: {_obj}, state: {orders_row, order_row, prm_row, invoice}} = this;
    return <Grid container>
      <Orders _obj={_obj} row={orders_row} setRow={this.set_row('orders')}/>
    </Grid>;
  }
}

Additions.propTypes = {
  _obj: PropTypes.object.isRequired,
};

export default Additions;
