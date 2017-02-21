import React, { Component } from 'react';

import numberWithCommas from '../Utils'


/*
 *  Shows top states with complaints against a company.
 */
export default class CompanyComplaintDetails extends Component {

  constructor(props) {
    super(props);
  }

  renderStateRows(companyStateComplaints) {
    var rows = [];
    companyStateComplaints.forEach((stateComplaint, index) => {
        var cells = [];
        cells.push(React.DOM.td({ key: "1", style: {width: '50px'}}, (index + 1).toString()));
        cells.push(React.DOM.td({ key: "state", style: {width: '200px'}}, stateComplaint.state_name));
        cells.push(React.DOM.td({ key: "count"}, numberWithCommas(stateComplaint.count)));
        var row = React.DOM.tr({key: index, id: stateComplaint.state, onClick: this.props.onStateRowClicked}, cells);
        //var row = React.DOM.tr({key: index, onClick: this.props.onStateRowClicked, id: state.state}, cells);
        rows.push(row);
    });
    return(rows);
  }


  render() {
    if (this.props.companyStateComplaints.length > 0) {
      return(
        <table id="companyStateComplaintsSection">
          <tbody>
          <tr>
            <td>
                <div className="detailsBanner">
                    <span className="stateTitle">{ this.props.company}</span>
                    <div
                      onClick={this.props.onCloseComplaintDetails}
                      className="sectionCloseButton">Close</div>
                    <br/>
                    <span className="stateSubTitle">States With Most Complaints Against Company</span>
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
                    { this.renderStateRows(this.props.companyStateComplaints) }
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



