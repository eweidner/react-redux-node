import React, { Component, PropTypes } from 'react';


export default class StateFieldHeader extends Component {
    constructor(props) {
        super(props);
    }

    onClicked() {
        var sortField = this.props.code;
        _dispatcher.publish({target: "StateList", subject: "sortChanged", sortField: sortField});
    }

    render() {
        return(
            <th onClick={this.onClicked.bind(this) } >
                { this.props.name }
            </th>
        )
    }
}