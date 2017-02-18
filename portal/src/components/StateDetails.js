import React, { Component } from 'react';

import ProductComplaintsTable from './ProductComplaintsTable'
import CompanyComplaintsTable from './CompanyComplaintsTable'


export default class StateDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { selectedState, productComplaints, companyComplaints } = this.props

    return (

      <table id="stateDetailsTable">
        <tbody>
          <tr>
            <td colSpan="2" ><span>Consumber Complaint Information for {selectedState}</span></td>
          </tr>
          <tr>
            <td>
              <ProductComplaintsTable productComplaints={productComplaints }/>
            </td>
            <td>
              <CompanyComplaintsTable companyComplaints={companyComplaints }/>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
