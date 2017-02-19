import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';

import * as topStatesActions from '../actions/TopStatesActions';
import TopStates from '../components/TopStates';


/**
 * It is common practice to have a 'Root' container/component require our main App (this one).
 * Again, this is because it serves to wrap the rest of our application with the Provider
 * component to make the Redux store available to the rest of the app.
 */
class App extends Component {
  render() {
    // we can use ES6's object destructuring to effectively 'unpack' our props
    // const { topStatesAction, counter, counterActions } = this.props;
    // var initialStateQueryParams = new Object();
    // initialStateQueryParams['field'] = 'pop';
    // initialStateQueryParams['year'] = 2015;
    // initialStateQueryParams['month'] = 8;
    // initialStateQueryParams['limit'] = 10;
    var initialTopStates = [];
    return (
      <div>
        <Header/>
        <div className="main-app-container">
          <TopStates sortField='pop' year={2015} month={7} limit={10} topStates={initialTopStates} actions={topStatesActions} />
          <Footer />
        </div>

      </div>
    );
  }
}

App.propTypes = {
    // counter: PropTypes.number.isRequired,
    // counterActions: PropTypes.object.isRequired,
    // topStatesActions: PropTypes.object.isRequired
};

/**
 * Keep in mind that 'state' isn't the state of local object, but your single
 * state in this Redux application. 'counter' is a property within our store/state
 * object. By mapping it to props, we can pass it to the child component Counter.
 */
function mapStateToProps(state) {
  return {
    // counter: state.counter,
    // stateQueryParams: state.stateQueryParams
  };
}

/**
 * Turns an object whose values are 'action creators' into an object with the same
 * keys but with every action creator wrapped into a 'dispatch' call that we can invoke
 * directly later on. Here we imported the actions specified in 'CounterActions.js' and
 * used the bindActionCreators function Redux provides us.
 *
 * More info: http://redux.js.org/docs/api/bindActionCreators.html
 */
function mapDispatchToProps(dispatch) {
  return {
    //actions: bindActionCreators(CounterActions, dispatch)
  };
}

/**
 * 'connect' is provided to us by the bindings offered by 'react-redux'. It simply
 * connects a React component to a Redux store. It never modifies the component class
 * that is passed into it, it actually returns a new connected componet class for use.
 *
 * More info: https://github.com/rackt/react-redux
 */

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
