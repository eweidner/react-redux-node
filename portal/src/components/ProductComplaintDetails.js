import React, { Component } from 'react';

import numberWithCommas from '../Utils'


export default class ProductComplaintDetails extends Component {

  constructor(props) {
    super(props);
  }

  renderStateRows(productStateComplaints) {
    var rows = [];
    productStateComplaints.forEach((productStateComplaint, index) => {
      var cells = [];
      cells.push(React.DOM.td({ key: "1", style: {width: '50px'}}, (index + 1).toString()));
      cells.push(React.DOM.td({ key: "state", style: {width: '200px'}}, productStateComplaint.state_name));
      cells.push(React.DOM.td({ key: "count"}, numberWithCommas(productStateComplaint.count)));
      var row = React.DOM.tr({key: index}, cells);
      rows.push(row);
    });
    return(rows);
  }

  render() {
    if ((this.props.productStateComplaints) && (this.props.productStateComplaints.length > 0)) {
      return(
        <table id="productStateComplaintsSection">
          <tbody>
          <tr>
            <td>
              <div className="detailsBanner">
                <span className="stateTitle">{ this.props.product}</span>
                      <div
                        onClick={this.props.onCloseComplaintDetails}
                        className="sectionCloseButton">Close</div>
                <br/>
                  <span className="stateSubTitle">States With Most Complaints Against Product</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <table className="statesTable">
                <thead>
                <tr>
                  <th>Rank</th>
                  <th>State</th>
                  <th>Complaint Count</th>
                </tr>
                </thead>
                <tbody>
                    { this.renderStateRows(this.props.productStateComplaints) }
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



