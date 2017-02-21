import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { fetchCensusImportStatus, fetchComplaintsImportStatus} from '../actions/TopStatesActions'


class Header extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(fetchComplaintsImportStatus())
        this.props.dispatch(fetchCensusImportStatus())
        self = this;
        setInterval(function(){
            console.info("Finding import status");
            self.props.dispatch(fetchComplaintsImportStatus())
            self.props.dispatch(fetchCensusImportStatus())
        }, 10000);
    }


    render() {
        var censusStatus = "Loaded";
        var censusStatusClass = "statusLoaded"
        if (this.props.censusImporting) {
            censusStatus = "Loading...";
            censusStatusClass = "statusLoading"
        }
        var complaintsStatus = "Loaded";
        var complaintsStatusClass = "statusLoaded"
        if (this.props.complaintsImporting) {
            complaintsStatus = "Loading...";
            complaintsStatusClass = "statusLoading"
        }
        return (
          <header className="mainHeader">
              <table className="headerTable">
                  <tr>
                      <td><h1>About States and Consumer Complaints</h1></td>
                      <td>
                          <div className="importStatusHolder" >
                              <table>
                                  <tr>
                                      <td>Census Import</td>
                                      <td><div className={censusStatusClass}>{ censusStatus }</div></td>
                                  </tr>
                                  <tr>
                                      <td>Complaints Import</td>
                                      <td><div className={complaintsStatusClass}>{ complaintsStatus }</div></td>
                                  </tr>
                              </table>

                          </div>
                      </td>
                  </tr>
              </table>

          </header>
        );
    }
}


function mapStateToProps(state) {
    var newProps = {
        complaintsImporting: state.importStatusReducer.complaintsImporting,
        censusImporting: state.importStatusReducer.censusImporting
    }

    return newProps;
}

export default connect(mapStateToProps)(Header)
