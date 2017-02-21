import React, { Component } from 'react';

import numberWithCommas from '../Utils'


/*
 *  For a selected state, show top ten companies with highest cons. complaints.
 */
export default class CompanyComplaintsTable extends Component {

  constructor(props) {
    super(props);
  }

  renderCompanyRows(companies) {
    var rows = [];
    companies.forEach((company, index) => {
        // Used non-JSX to make it easier to assign a key.
        var cells = [];
        cells.push(React.DOM.td({ key: "1", style: {width: '50px'}}, (index + 1).toString()));
        cells.push(React.DOM.td({ key: company.name, style: {width: '420px'}}, company.company));
        cells.push(React.DOM.td({ key: "count"}, numberWithCommas(company.count)));
        var row = React.DOM.tr({key: company + index.toString(), onClick: this.props.onCompanyRowClicked}, cells);
        rows.push(row);
    });
    return(rows);
  }


  render() {
    if (this.props.companyComplaints.length > 0) {
      return(
        <div>
          <table id="companyComplaintsTable">
            <tbody>
            <tr>
              <td>
                <span className="tableTopHeader">Companies with most Consumer Complaints</span>
              </td>
            </tr>
            <tr>
              <td>
                <table className="statesTable">
                  <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Company</th>
                    <th>Count</th>
                  </tr>
                  </thead>
                  <tbody>
                  { this.renderCompanyRows(this.props.companyComplaints) }
                  </tbody>
                </table>
              </td>
            </tr>
            </tbody>
          </table>
          <span className="underTableInstructions">Click a Company to See States with Most Complaints</span>
        </div>
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



