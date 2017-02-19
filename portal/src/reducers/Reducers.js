import { combineReducers } from 'redux';
import {  REQUEST_TOP_STATES, FETCH_TOP_STATES, RECEIVE_TOP_STATES,
          INVALIDATE_TOP_STATES, SELECT_SORTFIELD,
          REQUEST_COMPANY_COMPLAINTS, RECEIVE_COMPANY_COMPLAINTS, REQUEST_PRODUCT_COMPLAINTS,
          RECEIVE_PRODUCT_COMPLAINTS, REQUEST_STATE_PROFILES, RECEIVE_STATE_PROFILES,
          SWITCH_UI_TO_STATE_CENTRIC, SWITCH_UI_TO_PRODUCT_CENTRIC, SWITCH_UI_TO_COMPANY_CENTRIC,
          RECEIVE_COMPANY_DETAILS, RECEIVE_PRODUCT_DETAILS, CLEAR_COMPLAINT_DETAILS
} from '../constants/ActionTypes';


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
              selectedStateCode: action.productQueryParams.state
            })
          case RECEIVE_COMPANY_COMPLAINTS:
            console.info("TopStatesReducer - receive complaint companies");
            return Object.assign({}, state, {
              companyComplaints: action.companyComplaints,
              selectedStateCode: action.companyQueryParams.state
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
        stateSelectionParams: {
            field: 'pop',
            year: 2015,
            month: 6,
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
                    didInvalidate: true,
                    stateSelectionParams: action.stateSelectionParams
                })
            case REQUEST_TOP_STATES:
                return Object.assign({}, state, {
                    isFetching: true,
                    didInvalidate: false,
                    stateSelectionParams: action.stateSelectionParams
                })
            case RECEIVE_TOP_STATES:
                console.info("TopStatesReducer - receive top states");
                return Object.assign({}, state, {
                    isFetching: false,
                    didInvalidate: false,
                    topStates: action.topStates,
                    lastUpdated: action.receivedAt,
                    stateSelectionParams: action.stateSelectionParams
                })
            default:
                return state
        }
    }
}


function uiSettingsReducer(state, action) {
  const initialState = {
    mode: "state-centric"
  }

  if (typeof state === 'undefined') {
    return initialState
  } else {
    switch (action.type) {
      case SWITCH_UI_TO_STATE_CENTRIC:
        return Object.assign({}, state, {
          mode: "state-centric"
        })
      case SWITCH_UI_TO_PRODUCT_CENTRIC:
        return Object.assign({}, state, {
          mode: "product-centric"
        })
      case SWITCH_UI_TO_COMPANY_CENTRIC:
        return Object.assign({}, state, {
          mode: "company-centric"
        })
      default:
        return state
    }
  }

}


function companyDetailsReducer(state, action) {
  const initialState = {
      companyStateComplaints: [],
  }

  if (typeof state === 'undefined') {
    return initialState
  } else {
    switch (action.type) {
      case CLEAR_COMPLAINT_DETAILS:
        return Object.assign({}, state, {
          companyStateComplaints: [],
          selectedCompany: null
        })
      case RECEIVE_COMPANY_DETAILS:
        console.info("TopStatesReducer - receive top states");
        return Object.assign({}, state, {
          companyStateComplaints: action.companyStateComplaints,
          selectedCompany: action.companySelectionParams.company
        })
      default:
        return state
    }
  }
}

function productDetailsReducer(state, action) {
  const initialState = {
    productStateComplaints: [],
  }

  if (typeof state === 'undefined') {
    return initialState
  } else {
    switch (action.type) {
      case CLEAR_COMPLAINT_DETAILS:
        return Object.assign({}, state, {
          productStateComplaints: [],
          selectedProduct: null
        })
      case RECEIVE_PRODUCT_DETAILS:
        return Object.assign({}, state, {
          productStateComplaints: action.productStateComplaints,
          selectedProduct: action.productSelectionParams.product
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
    stateProfilesReducer,
    uiSettingsReducer,
    companyDetailsReducer,
    productDetailsReducer
});

export default rootReducer;
