import React, { Component, PropTypes } from 'react'


class StateSelectionParams extends React.Component {
    constructor(props) {
        super(props);
        this.handleYearChange = this.handleYearChange.bind(this)
        this.handleMonthChange = this.handleMonthChange.bind(this)
    }


    handleYearChange(nextYear) {
        this.props.dispatch(selectStateMonthYear(this.props.selectionParams.month, nextYear))
    }

    handleMonthChange(nextMonth) {
        this.props.dispatch(selectStateMonthYear(nextMonth, this.props.selectionParams.year))
    }

    render() {
        const { selectionParams } = this.props

        return(
            <table>
                <tbody>
                    <tr>
                          <td key="year">
                              <Picker key={'yearPicker'} value={this.props.selectionParams.year.toString()} onChange={this.handleYearChange}
                                      options={[ '2013', '2014', '2015', '2016' ]} />
                          </td>
                          <td key="month">
                              <Picker key={'monthPicker'} value={this.props.selectionParams.month.toString()}onChange={this.handleMonthChange}
                                      options={[ '1', '2', '3', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ]} />
                          </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

