/*
 *  Single Reducer, Single Action
 */
var Redux = require('redux');
// Middleware to accept function type of actions
var reduxThunk = require('redux-thunk').default
const ACTION_ADD_MEMBER = "ADD_MEMBER"



// This is a Redux action.  It passes the reducers a 'type' and needed data for the state change.
function addMember(newMember) {
    return {
        type: ACTION_ADD_MEMBER,  // This will instruct the Reducer about how to handle the data.
        newMember: newMember
    };
}

/*
 *  One Reducer for this Redux example.  Manages the changing of states in the Redux store.
 *  Redux will call all reducer functions when action functions do something to indicate a state change.
 */
function membershipReducer(state, action) {
    var initialData = {
        members: []
    };

    // Undefined is passed to all reducers initially.  A chance to establish an initial state.
    if (typeof state === 'undefined') {
        console.info("membershipReducer initializing members.");
        return initialData
    }
    switch (action.type) {
        case ACTION_ADD_MEMBER:
            // Return a copy of the store state with any changes needed.  Don't change the original, leave that to
            // Redux.
            var nextState =  Object.assign({}, state, {});
            console.info("membershipReducer adding member: " + action.newMember);
            nextState.members.push(action.newMember);
            return nextState;
        default:
            return state
    }
}

/*
 * Create a store with it's reducer(s).  Thunk middleware allows 'dispatch' type of action calls - which
 * act asynchronously.  Asynchronous doesn't really help this example, but will be important for
 * using actions that require db, file or api calls.
 */
//
var store = Redux.createStore(membershipReducer, Redux.applyMiddleware(reduxThunk));


// Make a function to receive state changes of the store
function receiveStoreStateChange() {
    var state = store.getState();
    console.info("Listener received members: " + state.members);
}

store.subscribe(receiveStoreStateChange);

// This starts the actions.
store.dispatch(addMember('Mary'))
store.dispatch(addMember('Bill'))
store.dispatch(addMember('Jerry'))
console.info("All members have been sent to Redux.");


