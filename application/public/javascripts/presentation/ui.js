
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


//---------------------------------------------------

function getStates(callback) {
    var result = fetch('/api/states')
    result.then(function(response) {
        console.log('response', response)
        return response.text()
    }).then(function(text) {
        var responseJson = JSON.parse(text);
        var states = responseJson.states;
        callback(states);
    }).catch(function(ex) {
        console.log('failed', ex)
    })
}


function getTopStates(params, callback) {
    //http://localhost:3000/api/census/topstates?year=2016&month=5&field=births&limit=3
    var result = fetch(`/api/census/topstates?year=${params.year}&month=${params.month}&field=${params.field}&limit=${params.limit}`);
    result.then(function(response) {
        console.log('response', response)
        return response.text()
    }).then(function(text) {
        var responseJson = JSON.parse(text);
        var states = responseJson.states;
        callback(states);
    }).catch(function(ex) {
        console.log('failed', ex)
    })
}


class Header extends React.Component {
    render() {
        return (
            <div className="header">Fun Facts About States</div>
        );
    }
}


class StateSelector extends React.Component {
    constructor() {
        super();
        //this.state = {states: "Colorado,Nevada"};
        var self = this;
        this.state = {states: []};
        this.updateStates = function(states) {
            console.info("Got all states: " + states);
            self.setState({states: states});
        }
        getStates(this.updateStates);
    }

    componentWillUpdate(nextProps, nextState) {
        console.info("StateSelector.componentWillUpdate");
        return(true);
    }

    renderStateHash(states) {
        var stateElements = [];
        states.forEach((state, index) => {
            // Used non-JSX to make it easier to assign a key.
            var div = React.DOM.div({ key: index}, state.name);
            stateElements.push(div);
        });
        return(stateElements);
    }

    render() {
        return (
            <div>
                <span>{ this.renderStateHash(this.state.states) } </span>
            </div>
        );
    }
}


class StateFieldHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <th>
                { this.properties.name}
            </th>
        )
    }

}


class TopStates extends React.Component {
    constructor() {
        super();
        var topStates = this;
        this.state = {states: []};
        this.updateStates = function(states) {
            console.info("Got top states: " + states);
            //self.state.states = states;
            topStates.setState({states: states});
        }
        var stateSelectParams = { limit: 10, year: 2016, month: 5, field: 'births' };
        getTopStates(stateSelectParams, this.updateStates);
    }

    componentWillUpdate(nextProps, nextState) {
        console.info("TopStates.componentWillUpdate");
        return(true);
    }

    renderStateRows(states) {
        var stateRows = [];
        var states = this.state.states.slice();
        this.state.states.forEach((state, index) => {
            // Used non-JSX to make it easier to assign a key.
            var cells = [];
            cells.push(React.DOM.td({ key: "1"}, index.toString()));
            cells.push(React.DOM.td({ key: state.state_name}, state.state_name));
            cells.push(React.DOM.td({ key: state.pop}, numberWithCommas(state.pop)));
            cells.push(React.DOM.td({ key: state.popgrowth}, numberWithCommas(state.popgrowth)));
            cells.push(React.DOM.td({ key: state.births}, numberWithCommas(state.births)));
            cells.push(React.DOM.td({ key: state.deaths}, numberWithCommas(state.deaths)));
            var row = React.DOM.tr({key: index}, cells);
            stateRows.push(row);
        });
        return(stateRows);
    }

    render() {
        return (
            <table className="statesTable">
                <thead>
                    <tr>
                        <th className="noClickHeader"></th>
                        <th className="noClickHeader"></th>
                        <StateFieldHeader name="Population" selected="true"/>
                        <th>Growth</th>
                        <th>Births</th>
                        <th>Deaths</th>
                    </tr>
                </thead>
                <tbody>
                    { this.renderStateRows(this.state.states) }
                </tbody>
            </table>

            // <div>
            //     <div>TOP STATES</div>
            //     <div>{ this.renderStateHash(this.state.states) } </div>
            // </div>
        );
    }
}


class Content extends React.Component {
    renderTopStates() {
        return <TopStates />
    }

    render() {
        return (
            <div className="content">
                { this.renderTopStates() }
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
    renderStateSelect() {
        var stateSelector = <StateSelector />
        return(stateSelector);
    }
    render() {
        return (
            <div>
                { this.renderHeader() }
                { this.renderContent() }
                { this.renderStateSelect() }
            </div>
        )
    }
}

ReactDOM.render(
    <Page />,
    document.getElementById('dynamic_page')
);



