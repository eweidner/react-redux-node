import React, { Component } from 'react';

import ProductComplaintsTable from './ProductComplaintsTable'
import CompanyComplaintsTable from './CompanyComplaintsTable'


export default class StateDetails extends Component {
  constructor(props) {
    super(props);
  }

  sectionTitle() {
    if (this.props.state) {
      return(this.props.state.name);
    } else {
      return ""
    }
  }

  render() {
    const { state, productComplaints, companyComplaints } = this.props

    if ((productComplaints.length > 0) || (companyComplaints.length > 0)) {
      return (
        <table id="stateDetailsTable">
          <tbody>
          <tr>
            <td colSpan="2" >
              <div className="detailsBanner">
                <span className="stateTitle">{this.sectionTitle()}</span><br/>
                <span className="stateSubTitle">Consumer Complaint Information</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <ProductComplaintsTable onProductRowClicked={this.props.onProductRowClicked} productComplaints={productComplaints }/>
            </td>
            <td>
              <CompanyComplaintsTable onCompanyRowClicked={this.props.onCompanyRowClicked} companyComplaints={companyComplaints }/>
            </td>
          </tr>
          </tbody>
        </table>
      );

    } else {
        return(<div></div>);
    }
  }
}
