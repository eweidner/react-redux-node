import React, { Component, PropTypes } from 'react';
import StateFieldHeader from './StateFieldHeader';


export default class TopStates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {states: []};

        this.findTopStates('pop');
        self = this;
        // _dispatcher.subscribe(function(event) {
        //     //{target: "StateList", subject: "sortChanged", sortField: sortField}
        //     if (event.target == 'StateList') {
        //         if (event.subject == 'sortChanged') {
        //             self.findTopStates(event.sortField);
        //         } else {
        //             throw("Unhandled event");
        //         }
        //     }
        // });
    }

    /*
     * API lookup of top states by population category.  Update component state to force rendering.
     */
    findTopStates(sortField) {
        var stateSelectParams = { limit: 10, year: 2016, month: 5, field: sortField };
        self = this;
        getTopStates(stateSelectParams, function(states) {
            console.info("Got top states " + states.length);
            self.setState({states: states});
        });
    }


    componentWillUpdate(nextProps, nextState) {
        return(true);
    }

    renderStateRows(states) {
        var stateRows = [];
        console.info("Rendering: " + states.length + " rows.");
        states.forEach((state, index) => {
            // Used non-JSX to make it easier to assign a key.
            var cells = [];
            cells.push(React.DOM.td({ key: "1", style: {width: '50px'}}, (index + 1).toString()));
            cells.push(React.DOM.td({ key: state.state_name}, state.state_name));
            cells.push(React.DOM.td({ key: state.pop}, numberWithCommas(state.pop)));
            cells.push(React.DOM.td({ key: state.popgrowth}, numberWithCommas(state.popgrowth)));
            cells.push(React.DOM.td({ key: state.births}, numberWithCommas(state.births)));
            cells.push(React.DOM.td({ key: state.deaths}, numberWithCommas(state.deaths)));
            var row = React.DOM.tr({key: index, onClick: this.rowClicked.bind(this), id: state.state}, cells);
            stateRows.push(row);
        });
        return(stateRows);
    }


    rowClicked(event) {
        var stateCode = event.target.parentNode.id;
        //this.props.onSelectState(stateCode);
        _dispatcher.publish({target: "StateManager", subject: "stateChanged", selectedState: stateCode});
    }

    render() {
        return (
            <div>
                <h2>
                    Top States for Population Categories
                </h2>
                <span>Click Any State Row for Details</span>
                <table className="statesTable">
                    <thead>
                    <tr>
                        <th className="noClickHeader"></th>
                        <th className="noClickHeader"></th>
                        <StateFieldHeader name="Population" parent={this} code="pop" selected="true"/>
                        <StateFieldHeader name="Net Growth" parent={this} code="popgrowth" selected="true"/>
                        <StateFieldHeader name="Births" parent={this} code="births" selected="true"/>
                        <StateFieldHeader name="Deaths" parent={this} code="deaths" selected="true"/>
                    </tr>
                    </thead>
                    <tbody>
                    { this.renderStateRows(this.state.states) }
                    </tbody>
                </table>

            </div>
        );
    }
}
