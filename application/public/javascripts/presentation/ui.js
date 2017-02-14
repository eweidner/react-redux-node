//import Connector from '../container/connector.js';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import axios from 'axios';
//import ApiUtils from '../container/ApiUtils'

let email = "joe@example.com";

function getStates(callback) {
    fetch('/api/states', {
        method: 'get'
    }).then(function(response) {
        var data = response.json()
        .then(ApiUtils.checkStatus(response))
        .then((data) => {
            callback(data);
        }).catch( (err) => {
            console.error("Error occurred: " + err.message);
            alert("Error occurred: " + err.message);

        });
    }).catch(function(err) {
        console.error("Error occurred: " + err.message);
        alert("Error occurred: " + err.message);
    });
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
    constructor(props) {
        super(props);
        if (true) {
            alert("In constructor");
        }
        getStates(this.updateStates);
        this.state = {
            states: [{code: "az", name: "Arizona"}, {code: "co", name: "Colorado"}]
        };
    }

    updateStates(states) {
        this.state.states = [];
        states.forEach( (state) => {
            this.state.states.push(state);
        });
    }
    renderStateList() {
        if (this.state.states.length > 0) {
            // this.state.states.forEach(state => {
            //     <li key={state.code}>{state.name}</li>
            // })
            return <li>States found - but not yet displayed.</li>
        } else {
            return <li>Empty States</li>
        }
    }

    render() {
        return (
            <div>
                <ul>
                    { this.renderStateList() }
                </ul>
            </div>
        );
    }
}


class Page extends React.Component {
    renderHeader() {
        return <Header />;
    }
    renderContent() {
        return <StateSelector />
    }
    render() {
        return (
            <div>
                { this.renderHeader() }
                { this.renderContent() }
            </div>
        );
    }
}


ReactDOM.render(
    <Page />,
    document.getElementById('dynamic_page')
);