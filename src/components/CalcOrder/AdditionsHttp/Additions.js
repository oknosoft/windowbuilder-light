import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Orders from './Orders';
import OrderRows from './OrderRows';
import OrderRowProps from './OrderRowProps';
import handleCalck from './handleCalck';

class Additions extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      orders_row: null,
      order_row: null,
      invoice: null,
      is_supplier: null,
    };
  }

  componentDidMount() {
    const {orders} = this.props._obj;
    if(orders.count()) {
      this.set_row('orders')(orders.get(0));
    }

    $p.cat.scheme_settings.find_rows({obj: 'doc.purchase_order.goods'}, (scheme) => {
      if(scheme.name.endsWith('http')) {
        this.scheme = scheme;
      }
    });
  }

  handleCalck() {
    return handleCalck(this.props._obj)
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
        return row.invoice;
      })
      .then((invoice) => {
        row.invoice = invoice;
        const state = {invoice, supplier: row.is_supplier};
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
    const {props: {_obj}, state: {orders_row, order_row, invoice}, scheme} = this;
    return <Grid
      container
      direction="row"
      alignItems="stretch"
      spacing={1}
    >
      <Orders _obj={_obj} row={orders_row} setRow={this.set_row('orders')}/>
      <OrderRows invoice={invoice} row={order_row} setRow={this.set_row('order')} scheme={scheme} calc_order={_obj}/>
      <OrderRowProps row={order_row} supplier={orders_row && orders_row.is_supplier}/>
    </Grid>;
  }
}

Additions.propTypes = {
  _obj: PropTypes.object.isRequired,
};

export default Additions;
