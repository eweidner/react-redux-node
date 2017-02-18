import React, { Component, PropTypes } from 'react'


export default class StateFieldHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { displayName, onClick, fieldName } = this.props

        return(
          <th>State Header</th>
        )
        // return(
        //     <th onChange={e => onClick(fieldName, e.target.value)} >
        //         { displayName }
        //     </th>
        // )
    }
}
