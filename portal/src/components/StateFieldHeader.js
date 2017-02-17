import React, { Component, PropTypes } from 'react'


class StateFieldHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { displayName, onClick, fieldName } = this.props

        return(
            <th onChange={e => onClick(fieldName, e.target.value)} >
                { displayName }
            </th>
        )
    }
}
