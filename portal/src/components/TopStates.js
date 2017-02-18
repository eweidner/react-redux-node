import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {  fetchTopStates, invalidateTopStates, selectSortFieldAction, fetchStateProfiles,
          showStateCompanyComplaints, showStateProductComplaints, findStateProfiles} from '../actions/TopStatesActions'
import Picker from './Picker'
import TopStatesTable from './TopStatesTable'
import StateDetails from './StateDetails'
import StateSelectionParams from './StateSelectionParams'

/*
 * Fake the date for now - hook up date selection later.
 */

function _makeSelectParamsFromSortField(sortField) {
    return({field: sortField, year: 2015, month: 8, limit: 10})
}


class TopStates extends Component {
  constructor(props) {
    super(props)
    this.onStateRowClicked = this.onStateRowClicked.bind(this);
  }

  onStateRowClicked(event) {
    var stateCode = event.target.parentNode.id;
    this.props.dispatch(showStateCompanyComplaints(stateCode))
    this.props.dispatch(showStateProductComplaints(stateCode))
  }


  componentDidMount() {
      console.info("componentDidMount");
      const { dispatch, sortField } = this.props
      if (sortField) {
        dispatch(fetchTopStates(_makeSelectParamsFromSortField(sortField)))
      } else {
        dispatch(selectSortFieldAction('pop'))
      }
      dispatch(fetchStateProfiles())
  }

    componentWillReceiveProps(nextProps) {
        console.info("componentWillReceiveProps - props were passed to this component");
        if (nextProps.sortField !== this.props.sortField) {
            console.info("  - sort field changed.");
            const { dispatch, sortField } = nextProps
            dispatch(selectSortFieldAction('pop'))
        }
    }

    columnHeaderClicked(fieldName, event) {
        console.info("Header clicked: " + fieldName);
    }


  render() {
      console.info("TopStates.render");
      const { sortField, year, month, topStates, isFetching, lastUpdated, stateProfiles, stateSeletionParams } = this.props
//      <StateSelectionParams selectionParams={stateSeletionParams}/>
      return (
        <div>
            <TopStatesTable topStates={topStates} stateProfiles={stateProfiles} onStateRowClicked={this.onStateRowClicked} onHeaderClicked={this.columnHeaderClicked} />
            <StateDetails  stateName={this.props.selectedStateName} companyComplaints={this.props.companyComplaints} productComplaints={this.props.productComplaints} />
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
    console.info(mapStateToProps);
    const { selectedTopStatesSortField, topStatesReducer } = state;
    var newProps = {
        stateSeletionParams: state.topStatesReducer.selectionParams,
        companyComplaints: state.stateDetailsReducer.companyComplaints,
        productComplaints: state.stateDetailsReducer.productComplaints,
        sortField: state.selectedTopStatesSortField,
        topStates: state.topStatesReducer.topStates,
        stateProfiles: state.stateProfilesReducer.stateProfiles
    }

    return newProps;
}

export default connect(mapStateToProps)(TopStates)
