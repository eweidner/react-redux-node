import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {  fetchTopStates, invalidateTopStates, selectSortFieldAction, fetchStateProfiles,
          showStateCompanyComplaints, showStateProductComplaints, findStateProfiles} from '../actions/TopStatesActions'
import Picker from './Picker'
import TopStatesTable from './TopStatesTable'
import StateDetails from './StateDetails'
//import StateSelectionParams from './StateSelectionParams'



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
  }



  onStateRowClicked(event) {
    var stateCode = event.target.parentNode.id;
    this.props.dispatch(showStateCompanyComplaints(stateCode))
    this.props.dispatch(showStateProductComplaints(stateCode))
  }


  componentDidMount() {
      console.info("componentDidMount");
      const { dispatch, sortField } = this.props
      this.props.dispatch(fetchStateProfiles())

      if (this.props.stateSelectionParams) {
         // this.props.dispatch(fetchTopStates(this.props.stateSelectionParams))
      } else {
         // dispatch(selectSortFieldAction('pop'))
      }
  }

    componentWillReceiveProps(nextProps) {
        console.info("componentWillReceiveProps - props were passed to this component");
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

  findStateProfileForCode(stateCode) {
      var foundProfile = null;
      return this.props.stateProfiles.find((profile) => { return (profile.code == stateCode)});
  }



render() {
      console.info("TopStates.render");
      const {   selectedStateCode, sortField,
                year, month, topStates, isFetching,
                lastUpdated, stateProfiles, stateSelectionParams } = this.props
      var selectedStateProfile = this.findStateProfileForCode(selectedStateCode);

      return (
          <div>
              <StateSelectionControl stateSelectionParams={stateSelectionParams}
                                     onMonthChange={this.onMonthChange}
                                     onYearChange={this.onYearChange}/>
              <TopStatesTable   topStates={topStates} stateProfiles={stateProfiles} onStateRowClicked={this.onStateRowClicked}
                                onHeaderClicked={this.onStateSortFieldChange}
                                selectedState={selectedStateCode} selectedField={stateSelectionParams.field} />
              <StateDetails   state={selectedStateProfile} companyComplaints={this.props.companyComplaints}
                              productComplaints={this.props.productComplaints} />
          </div>
        )
    }
}

TopStates.propTypes = {
    sortField: PropTypes.string,
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
    var newProps = {
        stateSelectionParams: state.topStatesReducer.stateSelectionParams,
        selectedStateCode: selectedStateCode,
        companyComplaints: state.stateDetailsReducer.companyComplaints,
        productComplaints: state.stateDetailsReducer.productComplaints,
        sortField: state.selectedTopStatesSortField,
        topStates: state.topStatesReducer.topStates,
        stateProfiles: state.stateProfilesReducer.stateProfiles
    }

    return newProps;
}

export default connect(mapStateToProps)(TopStates)
