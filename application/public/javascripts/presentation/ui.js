
function ApiCheckStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
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



class Square extends React.Component {
    render() {
        return (
            <button className="square">
                I am a square
            </button>
        );
    }
}

class Header extends React.Component {
    render() {
        return (
            <div className="header">
                Header
            </div>
        );
    }
}


class StateSelector extends React.Component {
    constructor() {
        super();
        //this.state = {states: "Colorado,Nevada"};
        self = this;
        this.state = {states: []};
        this.updateStates = function(states) {
            console.info("Got states: " + states);
            self.setState({states: states});
        }
        getStates(this.updateStates);
    }

    componentWillUpdate(nextProps, nextState) {
        return(true);
    }

    renderConditional() {
        if (true) {
            return <div>Conditional True</div>
        } else {
            return <div>Conditional False</div>
        }
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
                <span>{ this.state.states.length } </span>
                <span>{ this.renderConditional() } </span>
                <span>{ this.renderStateHash(this.state.states) } </span>
                <ul>
                    {
                         this.state.states.map(function(state, index) {
                             <li key="{index}">{ state.name }</li>
                         })
                    }
                </ul>
            </div>
        );
    }
}

// {
//
//     this.state.states.map(function(state, index) {
//         <div {key: index}>{ state.name }</div>
//     })
// }

var Excel = React.createClass({
    displayName: 'Excel',

    propTypes: {
        headers: React.PropTypes.arrayOf(
            React.PropTypes.string
        ),
        initialData: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(
                React.PropTypes.string
            )
        ),
    },

    getInitialState: function() {
        return {
            data: this.props.initialData,
            sortby: null,
            descending: false,
        };
    },

    _sort: function(e) {
        var column = e.target.cellIndex;
        var data = this.state.data.slice();
        var descending = this.state.sortby === column && !this.state.descending;
        data.sort(function(a, b) {
            return descending
                ? (a[column] < b[column] ? 1 : -1)
                : (a[column] > b[column] ? 1 : -1);
        });
        this.setState({
            data: data,
            sortby: column,
            descending: descending,
        });
    },

    render: function() {
        var state = this.state;
        return (
            <table>
                <thead onClick={this._sort}>
                <tr>{
                    this.props.headers.map(function(title, idx) {
                        if (state.sortby === idx) {
                            title += state.descending ? ' \u2191' : ' \u2193'
                        }
                        return <th key={idx}>{title}</th>;
                    })
                }</tr>
                </thead>
                <tbody>
                {
                    this.state.data.map(function(row, idx) {
                        return (
                            <tr key={idx}>{
                                row.map(function(cell, idx) {
                                    return <td key={idx}>{cell}</td>;
                                })
                            }</tr>
                        );
                    })
                }
                </tbody>
            </table>
        );
    }
});

// var headers = [
//     "Book", "Author", "Language", "Published", "Sales"
// ];
//
// var data = [
//     ["The Lord of the Rings", "J. R. R. Tolkien", "English", "1954-1955", "150 million"],
//     ["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry", "French", "1943", "140 million"],
//     ["Harry Potter and the Philosopher's Stone", "J. K. Rowling", "English", "1997", "107 million"],
//     ["And Then There Were None", "Agatha Christie", "English", "1939", "100 million"],
//     ["Dream of the Red Chamber", "Cao Xueqin", "Chinese", "1754-1791", "100 million"],
//     ["The Hobbit", "J. R. R. Tolkien", "English", "1937", "100 million"],
//     ["She: A History of Adventure", "H. Rider Haggard", "English", "1887", "100 million"],
// ];
//
// ReactDOM.render(
//     React.createElement(Excel, {
//         headers: headers,
//         initialData: data,
//     }),
//     document.getElementById("app")
// );
//


class Page extends React.Component {
    renderHeader() {
        return <Header />
    }
    renderContent() {
        var stateSelector = <StateSelector />
        return(stateSelector);
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



