import React, { Component, PropTypes } from 'react'

//import {StateFieldHeader} from './StateFieldHeader'
import numberWithCommas from '../Utils'
import { showStateCompanyComplaints, showStateProductComplaints, findStateProfile } from '../actions/TopStatesActions'
import { connect } from 'react-redux'


class StateFieldHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { displayName, onClick, fieldName } = this.props

    return(
        <th className="clickableHeader" onChange={e => onClick(fieldName, e.target.value)} >
            { displayName }
        </th>
    )
  }
}

export default class TopStatesTable extends Component {
  constructor(props) {
    super(props);
    this.rowClicked = this.rowClicked.bind(this)

  }

  rowClicked(event) {
    var stateCode = event.target.parentNode.id;
    this.props.dispatch(findStateProfile(stateCode))
    this.props.dispatch(showStateCompanyComplaints(stateCode))
    this.props.dispatch(showStateProductComplaints(stateCode))
  }

  renderStateRows(states) {
    var stateRows = [];
    console.info("Rendering: " + states.length + " rows.");
    states.forEach((state, index) => {
      var cells = [];
      cells.push(React.DOM.td({ key: "1", style: {width: '50px'}}, (index + 1).toString()));
      cells.push(React.DOM.td({ key: state.state_name}, state.state_name));
      cells.push(React.DOM.td({ key: state.pop}, numberWithCommas(state.pop)));
      cells.push(React.DOM.td({ key: state.popgrowth}, numberWithCommas(state.popgrowth)));
      cells.push(React.DOM.td({ key: state.births}, numberWithCommas(state.births)));
      cells.push(React.DOM.td({ key: state.deaths}, numberWithCommas(state.deaths)));

      var row = React.DOM.tr({key: index, onClick: this.props.onStateRowClicked, id: state.state}, cells);
      stateRows.push(row);
    });
    return(stateRows);
  }


  render() {
    const { topStates } = this.props
    if (topStates == null) {
      return(
        <h3>Rendering...</h3>
      )
    } else {
      return(
        <table className="statesTable">
          <thead>
          <tr>
            <th key="rank" className="noClickHeader"></th>
            <th key="state" className="noClickHeader"></th>
            <StateFieldHeader displayName="Population" parent={this} code="pop" selected="true"/>
            <StateFieldHeader displayName="Net Growth" parent={this} code="popgrowth" selected="true" />
            <StateFieldHeader displayName="Births" parent={this} code="births" selected="true" />
            <StateFieldHeader displayName="Deaths" parent={this} code="deaths" selected="true" />
          </tr>
          </thead>
          <tbody>
              { this.renderStateRows(topStates)}
          </tbody>
        </table>
      )

    }

  }
}
