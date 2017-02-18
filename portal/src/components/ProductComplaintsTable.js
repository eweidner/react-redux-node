import React, { Component } from 'react';

import numberWithCommas from '../Utils'


export default class ProductComplaintTable extends Component {

  constructor(props) {
    super(props);
  }

  renderProductRows(products) {
    var rows = [];
    products.forEach((product, index) => {
      // Used non-JSX to make it easier to assign a key.
      var cells = [];
      cells.push(React.DOM.td({ key: "1", style: {width: '50px'}}, (index + 1).toString()));
      cells.push(React.DOM.td({ key: product.product, style: {width: '200px'}}, product.product));
      cells.push(React.DOM.td({ key: "count"}, numberWithCommas(product.count)));
      var row = React.DOM.tr({key: index}, cells);
      rows.push(row);
    });
    return(rows);
  }


  render() {
    if (this.props.productComplaints.length > 0) {
      return(
        <table id="productComplaintsTable">
          <tbody>
          <tr>
            <td>
              <h3>Products with most Consumer Complaints</h3>
            </td>
          </tr>
          <tr>
            <td>
              <table className="statesTable">
                <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product Complaints</th>
                  <th>Count</th>
                </tr>
                </thead>
                <tbody>
                { this.renderProductRows(this.props.productComplaints) }
                </tbody>
              </table>
            </td>
          </tr>
          </tbody>
        </table>
      );

    } else {
      return(
        <div></div>
      );

    }

  }

}

function mapStateToProps(state) {
  console.info(mapStateToProps);
  throw new Error("Reached this");
  return newProps;
}



