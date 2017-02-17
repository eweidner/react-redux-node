import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchTopStates, invalidateTopStates } from '../actions/TopStatesActions'
import Picker from './Picker'
import StateFieldHeader from './StateFieldHeader'


/*
 * Fake the date for now - hook up date selection later.
 */

function _makeSelectParamsFromSortField(sortField) {
    return({field: sortField, year: 2015, month: 8, limit: 10})
}


class TopStates extends Component {
  constructor(props) {
    super(props)
    //props.stateQueryParams = {field: props.field, year: props.year, month: props.month, limit: 10};
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
      console.info("componentDidMount");
    const { dispatch, stateQueryParams } = this.props
    dispatch(fetchTopStates(stateQueryParams))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.field !== this.props.field) {
      const { dispatch, stateQueryParams } = nextProps
      dispatch(fetchTopStates(stateQueryParams))
    }
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, field } = this.props
    dispatch(invalidateTopStates(stateQueryParams))
    dispatch(fetchTopStates(stateQueryParams))
  }

   handleFieldChange(nextSelectField) {
       this.props.dispatch(fetchTopStates({field: field, state: this.state.state, year: this.state.year, month: this.state.month, limit: 10}))
   }

   columnHeaderClicked(fieldName, event) {
      console.info("Header clicked: " + fieldName);
   }

    renderTopStates(topStates) {
        if ((topStates) && (topStates.length > 0)) {
            return (
            <table className="statesTable">
                <thead>
                <tr>
                    <th className="noClickHeader"></th>
                    <th className="noClickHeader"></th>
                    <StateFieldHeader onClick={this.columnHeaderClicked} displayName="Population" fieldName="pop" selected="true"/>
                    <StateFieldHeader onClick={this.columnHeaderClicked} displayName="Net Growth" fieldName="popgrowth" selected="false"/>
                    <StateFieldHeader onClick={this.columnHeaderClicked} displayName="Births" fieldName="births" selected="false"/>
                    <StateFieldHeader onClick={this.columnHeaderClicked} displayName="Deaths" fieldName="deaths" selected="false"/>
                </tr>
                </thead>
                <tbody>
                   { this.renderStateRows(topStates) }
                </tbody>
            </table>
            )
        } else {
            return ""
        }
    }

  render() {
    const { field, year, month, limit, topStates, isFetching, lastUpdated } = this.props
    return (
      <div>
        { this.renderTopStates(topStates) }
        <Picker key={'fieldPicker'}
                value={field}
                onChange={this.handleFieldChange}
                options={[ 'pop', 'births', 'deaths', 'popgrowth' ]} />
        <Picker key={'yearPicker'}
                value={year}
                onChange={this.handleYearChange}
                options={[ '2013', '2014', '2015', '2016' ]} />
          <Picker key={'monthPicker'}
                  value={month}
                  onChange={this.handleMonthChange}
                  options={[ '1', '2', '3', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ]} />
          <p>
          {lastUpdated &&
          <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
            {' '}
            </span>
          }
          {!isFetching &&
          <a href='#'
             onClick={this.handleRefreshClick}>
            Refresh
          </a>
        }
        </p>
        }
      </div>
    )
  }
}

TopStates.propTypes = {
    stateQueryParams: PropTypes.object,
    topStates: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    const { field, year, month, limit, topStates, isFetching, lastUpdated, topStatesReducer } = state;
  //   const {
  //       isFetching,
  //       lastUpdated,
  //       topStates
  // } = topStatesReducer[stateQueryParams] || {
  //   isFetching: true,
  //   items: []
  // }

  return {
    topStates,
    field,
    year,
    month,
    limit,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(TopStates)
