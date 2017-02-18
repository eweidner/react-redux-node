import { combineReducers } from 'redux';
import {  REQUEST_TOP_STATES, FETCH_TOP_STATES, RECEIVE_TOP_STATES,
          INVALIDATE_TOP_STATES, SELECT_SORTFIELD,
          REQUEST_COMPANY_COMPLAINTS, RECEIVE_COMPANY_COMPLAINTS, REQUEST_PRODUCT_COMPLAINTS,
          RECEIVE_PRODUCT_COMPLAINTS, REQUEST_STATE_PROFILES, RECEIVE_STATE_PROFILES } from '../constants/ActionTypes';


export function selectedTopStatesSortField(state = 'pop', action) {
  if (typeof state === 'undefined') {

  } else {
    switch (action.type) {
      case SELECT_SORTFIELD:
        console.info("TopStates Reducer sortField changed to " + action.sortField)
        return Object.assign({}, state, {
          sortField: action.sortField
        })
      default:
        return state
    }
  }
}

function stateDetailsReducer(state, action) {
  console.info("TopStatesReducer.stateDetailsReducer called");
  const initialState = {
    selectedStateCode: 'ca',
    productComplaints: [],
    companyComplaints: []
  }

  if (typeof state === 'undefined') {
    return initialState
  } else {
      switch (action.type) {
          case REQUEST_COMPANY_COMPLAINTS:
            return Object.assign({}, state, {
              isFetchingCompanyComplaints: true,
              didInvalidateCompanyComplaints: false
            })
          case REQUEST_PRODUCT_COMPLAINTS:
            return Object.assign({}, state, {
              isFetchingProductComplaints: true,
              didInvalidateProductComplaints: false
            })
          case RECEIVE_PRODUCT_COMPLAINTS:
            console.info("TopStatesReducer - receive complaint products");
            return Object.assign({}, state, {
              productComplaints: action.productComplaints,
              selectedState: action.selectedStateCode
            })
          case RECEIVE_COMPANY_COMPLAINTS:
            console.info("TopStatesReducer - receive complaint companies");
            return Object.assign({}, state, {
              companyComplaints: action.companyComplaints,
              selectedState: action.selectedStateCode
            })
          default:
            return state
      }
  }
}

function stateProfilesReducer(state, action) {
  const initialState = {
    stateProfiles: [],
    isFetchingStateProfiles: true
  }
  if (typeof state === 'undefined') {
      // On initialization, state comes in as undefined.  Chance to set inititial state.
      return initialState
  } else {
      switch (action.type) {
          case REQUEST_STATE_PROFILES:
              return Object.assign({}, state, {
                  isFetchingStateProfiles: true,
              })
          case RECEIVE_STATE_PROFILES:
              return Object.assign({}, state, {
                  isFetchingStateProfiles: false,
                  stateProfiles: action.stateProfiles
              })
          default:
            return state
      }
  }
}

function topStatesReducer(state, action) {
    console.info("TopStatesReducer.topStates called");
    const initialState = {
        didInvalidate: false,
        topStates: [],
        selectionParams: {
            field: 'pop',
            year: 2016,
            month: 1,
            limit: 10
        }
    }

    if (typeof state === 'undefined') {
        // On initialization, state comes in as undefined.  Chance to set inititial state.
        return initialState
    } else {
        switch (action.type) {
            case INVALIDATE_TOP_STATES:
                return Object.assign({}, state, {
                    didInvalidate: true
                })
            case REQUEST_TOP_STATES:
                return Object.assign({}, state, {
                    isFetching: true,
                    didInvalidate: false
                })
            case RECEIVE_TOP_STATES:
                console.info("TopStatesReducer - receive top states");
                return Object.assign({}, state, {
                    isFetching: false,
                    didInvalidate: false,
                    topStates: action.topStates,
                    lastUpdated: action.receivedAt
                })
            default:
                return state
        }
    }
}



/**
 * combineReducers is important to understand. As your app might grow in size
 * and complexity, you will likely begin to split your reducers into separate
 * functions - with each one managing a separate slice of the state! This helper
 * function from 'redux' simply merges the reducers. Keep in mind we are using
 * the ES6 shorthand for property notation.
 *
 * If you're transitioning from Flux, you will notice we only use one store, but
 * instead of relying on multiple stores to manage diff parts of the state, we use
 * various reducers and combine them.
 *
 * More info: http://rackt.org/redux/docs/api/combineReducers.html
 */
const rootReducer = combineReducers({
  selectedTopStatesSortField,
  topStatesReducer,
  stateDetailsReducer,
  stateProfilesReducer
});

export default rootReducer;
