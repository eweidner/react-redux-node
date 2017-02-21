import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {    fetchTopStates, invalidateTopStates, selectSortFieldAction, fetchStateProfiles,
    showStateCompanyComplaints, showStateProductComplaints,
    fetchCompanyDetails, fetchProductDetails, findStateProfiles, closeComplaintDetails,
    invalidateComplaintData} from '../actions/TopStatesActions'
import Picker from './Picker'
import TopStatesTable from './TopStatesTable'
import StateDetails from './StateDetails'
import CompanyComplaintDetails from './CompanyComplaintDetails'
import ProductComplaintDetails from './ProductComplaintDetails'
import PopulationPieChart from './PopulationPieChart'



class StateSelectionControl extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { stateSelectionParams } = this.props
    return(
      <table>
        <tbody>
        <tr>
          <td key="year">Month</td>
          <td key="month">Year</td>
        </tr>
        <tr key="selectors">
          <td key="month">
            <Picker key={'monthPicker'} value={this.props.stateSelectionParams.month.toString()}
                    onChange={this.props.onMonthChange}
                    options={[ '1', '2', '3', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ]} />
          </td>
          <td key="year">
            <Picker key={'yearPicker'} value={this.props.stateSelectionParams.year.toString()}
                    onChange={this.props.onYearChange}
                    options={[ '2013', '2014', '2015', '2016' ]} />
          </td>
        </tr>
        </tbody>
      </table>
    )
  }
}




class TopStates extends Component {
    constructor(props) {
      super(props)
      this.onStateRowClicked = this.onStateRowClicked.bind(this);
      this.onMonthChange = this.onMonthChange.bind(this);
      this.onYearChange = this.onYearChange.bind(this);
      this.onStateSortFieldChange = this.onStateSortFieldChange.bind(this);
      this.onCompanyRowClicked = this.onCompanyRowClicked.bind(this);
      this.onProductRowClicked = this.onProductRowClicked.bind(this);
      this.onCloseComplaintDetails = this.onCloseComplaintDetails.bind(this);

    }


    /*
     *  User was viewing complaints about prod or company and clicked close on the dialog.
     */
    onCloseComplaintDetails(event) {
        this.props.dispatch(closeComplaintDetails())
    }

    onStateRowClicked(event) {
        var stateCode = event.target.parentNode.id;
        this.props.dispatch(showStateCompanyComplaints(stateCode))
        this.props.dispatch(showStateProductComplaints(stateCode))
    }

    onCompanyRowClicked(event) {
        var company = event.target.parentNode.id;
        var params = {
            year: this.props.stateSelectionParams.year - 6,
            month: this.props.stateSelectionParams.month,
            months: 100,
            company: company,
            limit: 10
        }
        this.props.dispatch(fetchCompanyDetails(params))
    }

    onProductRowClicked(event) {
        var product = event.target.parentNode.id;
        var params = {
          year: this.props.stateSelectionParams.year - 6,
          month: this.props.stateSelectionParams.month,
          months: 100,
          product: product,
          limit: 10
        }
        this.props.dispatch(fetchProductDetails(params))
    }

    /*
     *  Use component mounting to load initial states data based on default settings.
     */
    componentDidMount() {
        console.info("componentDidMount");
        const { dispatch, sortField } = this.props
        this.props.dispatch(fetchStateProfiles())
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sortField !== this.props.sortField) {
            console.info("  - sort field changed.");
            const { dispatch, sortField } = nextProps
            dispatch(selectSortFieldAction('pop'))
        }
    }

    onYearChange(nextYear) {
        var selectionParams = this.props.stateSelectionParams
        if (nextYear != selectionParams.year) {
            var newParams = {
                year: nextYear,
                month: selectionParams.month,
                field: selectionParams.field,
                limit: selectionParams.limit
            }
            this.props.dispatch(fetchTopStates(newParams))
            this.props.dispatch(invalidateComplaintData())
        }
    }

    onMonthChange(nextMonth) {
        var selectionParams = this.props.stateSelectionParams
        if (nextMonth != selectionParams.month) {
            var newParams = {
                year: selectionParams.year,
                month: nextMonth,
                field: selectionParams.field,
                limit: selectionParams.limit
            }
            this.props.dispatch(fetchTopStates(newParams))
            this.props.dispatch(invalidateComplaintData())
        }
    }

    onStateSortFieldChange(event) {
        var nextField = event.target.id;
        var selectionParams = this.props.stateSelectionParams
        if (nextField != selectionParams.field) {
            var newParams = {
            year: selectionParams.year,
            month: selectionParams.month,
            field: nextField,
            limit: selectionParams.limit
          }
          this.props.dispatch(fetchTopStates(newParams))
        }
    }

    findCensusFieldNameForCode(code) {
        var hash = {'pop': 'Population', 'popgrowth': 'Population Growth',
                'births': 'Birth Rate', 'deaths': 'Death Rate'};
        return hash[code];
    }

    findStateProfileForCode(stateCode) {
        var foundProfile = null;
        return this.props.stateProfiles.find((profile) => { return (profile.code == stateCode)});
    }



    componentDidUpdate(prevProps, prevState) {
        if ((this.props.topStates.length == 0) && (this.props.stateSelectionParams)) {
            this.props.dispatch(fetchTopStates(this.props.stateSelectionParams))
        }
    }

    render() {
        const {   selectedStateCode, sortField,
                  year, month, topStates, isFetching,
                  lastUpdated, stateProfiles, stateSelectionParams } = this.props
        var selectedStateProfile = this.findStateProfileForCode(selectedStateCode);
        var showComplaintDetailsData = ((this.props.companyStateComplaints.length > 0) || (this.props.productStateComplaints.length > 0));

        if (showComplaintDetailsData) {
          return (
            <div className="complaintDetailsHolder">
              <CompanyComplaintDetails company={this.props.selectedCompany}
                                       companyStateComplaints={this.props.companyStateComplaints}
                                       onStateRowClicked={this.onStateRowClicked}
                                       onCloseComplaintDetails={this.onCloseComplaintDetails}
              />
              <ProductComplaintDetails  product={this.props.selectedProduct}
                                        productStateComplaints={this.props.productStateComplaints}
                                        onStateRowClicked={this.onStateRowClicked}
                                        onCloseComplaintDetails={this.onCloseComplaintDetails}
              />
            </div>
          )
        } else {
          return (
            <div>
              <StateSelectionControl stateSelectionParams={stateSelectionParams}
                                     onMonthChange={this.onMonthChange}
                                     onYearChange={this.onYearChange}/>
              <table>
                <tbody>
                <tr>
                  <td>
                    <TopStatesTable   topStates={topStates}
                                      stateProfiles={stateProfiles}
                                      onStateRowClicked={this.onStateRowClicked}
                                      onHeaderClicked={this.onStateSortFieldChange}
                                      selectedState={selectedStateCode}
                                      selectedField={stateSelectionParams.field} />
                  </td>
                  <td>
                    <PopulationPieChart
                                sortField={this.props.stateSelectionParams.field}
                                updatedAt={this.props.updatePieChartAt}
                                productStateComplaints={this.props.productStateComplaints}
                                popFieldName={this.findCensusFieldNameForCode(this.props.stateSelectionParams.field)}
                                topStates={this.props.topStates} />
                  </td>
                </tr>
                </tbody>
              </table>

              <StateDetails   state={selectedStateProfile} companyComplaints={this.props.companyComplaints}
                              productComplaints={this.props.productComplaints}
                              onCompanyRowClicked={this.onCompanyRowClicked}
                              onProductRowClicked={this.onProductRowClicked}
              />
            </div>
          )

        }
      }
}

TopStates.propTypes = {
    year: PropTypes.number,
    month: PropTypes.number,
    limit: PropTypes.number,
    topStates: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    const { selectedTopStatesSortField, topStatesReducer } = state;
    var selectedStateCode = state.stateDetailsReducer.selectedStateCode;
    var importStatus = {};
    var newProps = {
        stateSelectionParams: state.topStatesReducer.stateSelectionParams,
        selectedStateCode: selectedStateCode,
        companyComplaints: state.stateDetailsReducer.companyComplaints,
        productComplaints: state.stateDetailsReducer.productComplaints,
        topStates: state.topStatesReducer.topStates,
        updatePieChartAt: state.topStatesReducer.updatePieChartAt,
        stateProfiles: state.stateProfilesReducer.stateProfiles,
        companyStateComplaints: state.companyDetailsReducer.companyStateComplaints,
        selectedCompany: state.companyDetailsReducer.selectedCompany,
        productStateComplaints: state.productDetailsReducer.productStateComplaints,
        selectedProduct: state.productDetailsReducer.selectedProduct,
    }

    return newProps;
}

export default connect(mapStateToProps)(TopStates)
