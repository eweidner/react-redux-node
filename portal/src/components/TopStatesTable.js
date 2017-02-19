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
    const { displayName, onClick, code } = this.props

    return(
        <th className="clickableHeader" onClick={e => onClick(code, e.target.value)} >
            { displayName }
        </th>
    )
  }
}

export default class TopStatesTable extends Component {
  constructor(props) {
    super(props);
    this.rowClicked = this.rowClicked.bind(this)
    this.onHeaderClicked = this.onHeaderClicked.bind(this);
  }

  onHeaderClicked(event) {
    this.props.onHeaderClicked(event);
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

  createClickableHeader(params) {
    var className = "clickableHeader";
    if (params.selected) className = "selectedClickableHeader";
    var head = React.DOM.th({key: params.code, className: className, onClick: this.onHeaderClicked, id: params.code}, params.displayName);

    return(head);
  }


render() {
    const { topStates, onHeaderClicked } = this.props
      if (topStates.length == 0) {
        return(
          <h3>Select a Date to get started.</h3>
        )
      } else {
        var selectedField = this.props.selectedField
        return(
        <div>
          <div className="detailsBanner">
            <span className="stateTitle">Top States for Census Categories</span><br/>
          </div>

          <table className="statesTable">
              <thead>
              <tr>
                <th key="rank" className="noClickHeader"></th>
                <th key="state" className="noClickHeader"></th>
                { this.createClickableHeader({
                      displayName: "Population",
                      code: "pop",
                      onClick: {onHeaderClicked},
                      selected: ("pop" == selectedField) })}
                { this.createClickableHeader({
                      displayName: "Net Growth",
                      code: "popgrowth",
                      onClick: {onHeaderClicked},
                      selected: ("popgrowth" == selectedField) })}
                { this.createClickableHeader({
                      displayName: "Births",
                      code: "births",
                      onClick: {onHeaderClicked},
                      selected: ("births" == selectedField) })}
                { this.createClickableHeader({
                      displayName: "Deaths",
                      code: "deaths",
                      onClick: {onHeaderClicked},
                      selected: ("deaths" == selectedField) })}
              </tr>
              </thead>
              <tbody>
                  { this.renderStateRows(topStates)}
              </tbody>
            </table>
          <span className="underTableInstructions">Click a State to See Its Consumer Complaints</span>
        </div>
        )

      }

  }
}
