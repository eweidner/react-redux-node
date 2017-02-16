
function ApiCheckStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Dispatcher() {
    this.subscribers = [];
}

Dispatcher.prototype.subscribe = function(handlerFunction) {
    this.subscribers.push(handlerFunction);
}

Dispatcher.prototype.publish = function(event) {
    this.subscribers.forEach(function(subscriber) {
        subscriber(event);
    });
}

var _dispatcher = new Dispatcher();

//---------------------------------------------------


class Header extends React.Component {
    render() {
        return (
            <div className="header">Fun Facts About States</div>
        );
    }
}


class StateFieldHeader extends React.Component {
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


class CompanyComplaintsTable extends React.Component {
    constructor(props) {
        super(props);
    }

    renderRows(companies) {
        var rows = [];
        companies.forEach((company, index) => {
            // Used non-JSX to make it easier to assign a key.
            var cells = [];
            cells.push(React.DOM.td({ key: "1", style: {width: '50px'}}, (index + 1).toString()));
            cells.push(React.DOM.td({ key: company.name, style: {width: '350px'}}, company.company));
            cells.push(React.DOM.td({ key: "count"}, numberWithCommas(company.count)));
            var row = React.DOM.tr({key: company + index.toString()}, cells);
            rows.push(row);
        });
        return(rows);
    }

    render() {
        return(
            <table id="companyComplaintsTable">
                <tbody>
                <tr>
                    <td>
                        <h3>Companies with most Consumer Complaints</h3>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table className="statesTable">
                            <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Company</th>
                                <th>Count</th>
                            </tr>
                            </thead>
                            <tbody>
                            { this.renderRows(this.props.companies) }
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }
}



class ProductComplaintsTable extends React.Component {
    constructor(props) {
        super(props);
    }

    renderProductRows(products) {
        var rows = [];
        products.forEach((product, index) => {
            // Used non-JSX to make it easier to assign a key.
            var cells = [];
            cells.push(React.DOM.td({ key: "1", style: {width: '50px'}}, (index + 1).toString()));
            cells.push(React.DOM.td({ key: product.product, style: {width: '200px'}}, product.product));
            cells.push(React.DOM.td({ key: "count"}, numberWithCommas(product.count)));
            var row = React.DOM.tr({key: index}, cells);
            rows.push(row);
        });
        return(rows);
    }

    render() {
        return(
            <table id="productComplaintsTable">
                <tbody>
                <tr>
                    <td>
                        <h3>Products with most Consumer Complaints</h3>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table className="statesTable">
                            <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Product Complaints</th>
                                <th>Count</th>
                            </tr>
                            </thead>
                            <tbody>
                            { this.renderProductRows(this.props.products) }
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }
}

class StateDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  products: [],
                        companies: [],
                    };
        if (props.selectedState) {
            this.setState({selectedState: props.selectedState});
        }
        self = this;
        // _dispatcher.subscribe(function(event) {
        //     if (event.target == 'StateDetails') {
        //         if (event.subject == 'stateChanged') {
        //             self.setState({selectedState: event.selectedState});
        //             self.findStateDetails(event.selectedState);
        //         } else {
        //             throw("Unhandled event");
        //         }
        //     }
        //
        // });

    }

    // componentDidMount() {
    //     self = this;
    // }

    findStateDetails(selectedState) {
        if (selectedState) {
            var params = { limit: 10, year: 2013, month: 1, months: 36, state: selectedState };
            var parent = this;
            getStateProductComplaintData(params, function(products) {
                parent.setState({products: products});
            });
            getStateCompanyComplaintData(params, function(companies) {
                parent.setState({companies: companies});
            });
        }
    }

    findStateName() {
        return(_stateNames[this.state.selectedState]);
    }

    render() {
        var displayValue = 'block';
        if (!this.state.selectedState) {
            displayValue = 'none';
        }
        return (
            <div className="stateDetails" style={{display: displayValue}} >
                <h2>
                    Details for { this.findStateName() }
                </h2>
                <table>
                    <tbody>
                        <tr>
                            <td valign="top">
                                <ProductComplaintsTable products={this.state.products} />

                            </td>
                            <td valign="top">
                                <CompanyComplaintsTable key={ "comp-comp-" +this.props.selectedState } companies={this.state.companies} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}


class TopStates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {states: []};

        this.findTopStates('pop');
        self = this;
        _dispatcher.subscribe(function(event) {
            //{target: "StateList", subject: "sortChanged", sortField: sortField}
            if (event.target == 'StateList') {
                if (event.subject == 'sortChanged') {
                    self.findTopStates(event.sortField);
                } else {
                    throw("Unhandled event");
                }
            }
        });
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


class Content extends React.Component {
    constructor() {
        super();
        this.state = {states: []};

        self = this;
        // _dispatcher.subscribe(function(event) {
        //     if (event.target == "StateManager") {
        //         if (event.subject == "stateChanged") {
        //             console.info("Received event");
        //             _dispatcher.publish({target: 'StateDetails', subject: "stateChanged", selectedStated: event.selectedState })
        //             self.setState({selectedState: event.selectedState});
        //         }
        //     }
        // });

    }

    // componentDidMount() {
    //     self = this;
    //     _dispatcher.subscribe(function(event) {
    //         if (event.target == "StateManager") {
    //             if (event.subject == "stateChanged") {
    //                 console.info("Received event");
    //                 _dispatcher.publish({target: 'StateDetails', subject: "stateChanged", selectedStated: event.selectedState })
    //                 self.setState({selectedState: event.selectedState});
    //             }
    //         }
    //     });
    // }


    renderStateDetails() {
        return(<StateDetails selectedState={ this.state.selectedState }/>);
    }

    renderTopStates() {
        this.topStates = <TopStates  />;
        return this.topStates;
    }

    render() {
        return (
            <div className="content">
                    { this.renderTopStates() }
                    { this.renderStateDetails() }
            </div>
        );
    }
}


class Page extends React.Component {
    renderHeader() {
        return <Header />
    }
    renderContent() {
        return <Content />
    }
    render() {
        return (
            <div>
                { this.renderHeader() }
                { this.renderContent() }
            </div>
        )
    }
}

ReactDOM.render(
    <Page />,
    document.getElementById('dynamic_page')
);



