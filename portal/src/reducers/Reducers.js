import { combineReducers } from 'redux';
import {  REQUEST_TOP_STATES, FETCH_TOP_STATES, RECEIVE_TOP_STATES,
          INVALIDATE_TOP_STATES, SELECT_SORTFIELD,
          REQUEST_COMPANY_COMPLAINTS, RECEIVE_COMPANY_COMPLAINTS, REQUEST_PRODUCT_COMPLAINTS,
          RECEIVE_PRODUCT_COMPLAINTS, REQUEST_STATE_PROFILES, RECEIVE_STATE_PROFILES,
          SWITCH_UI_TO_STATE_CENTRIC, SWITCH_UI_TO_PRODUCT_CENTRIC, SWITCH_UI_TO_COMPANY_CENTRIC,
          RECEIVE_COMPANY_DETAILS, RECEIVE_PRODUCT_DETAILS, CLEAR_COMPLAINT_DETAILS, INVALIDATE_COMPLAINT_DATA,
            RECEIVE_COMPLAINTS_IMPORT_STATUS, RECEIVE_CENSUS_IMPORT_STATUS
} from '../constants/ActionTypes';


export function selectedTopStatesSortField(state = 'pop', action) {
    if (typeof state === 'undefined') {

    } else {
        switch (action.type) {
            case SELECT_SORTFIELD:
                return Object.assign({}, state, {
                    sortField: action.sortField
                })
            default:
                return state
        }
    }
}

function stateDetailsReducer(state, action) {
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
                    didInvalidateCompanyComplaints: false,

                })
            case REQUEST_PRODUCT_COMPLAINTS:
                return Object.assign({}, state, {
                    isFetchingProductComplaints: true,
                    didInvalidateProductComplaints: false,
                })
            case RECEIVE_PRODUCT_COMPLAINTS:
                return Object.assign({}, state, {
                    productComplaints: action.productComplaints,
                    selectedStateCode: action.productQueryParams.state
                })
            case RECEIVE_COMPANY_COMPLAINTS:
                return Object.assign({}, state, {
                    companyComplaints: action.companyComplaints,
                    selectedStateCode: action.companyQueryParams.state
                })
            default:
                return state
        }
    }
}

/*
 *  Handle state of census and complaints importation.
 */
function importStatusReducer(state, action) {
    const initialState = {
        censusImporting: false,
        complaintsImporting: false
    }
    if (typeof state === 'undefined') {
        return initialState
    } else {
        switch (action.type) {
            case RECEIVE_COMPLAINTS_IMPORT_STATUS:
                return Object.assign({}, state, {
                    complaintsImporting: action.complaintsImporting
                })
            case RECEIVE_CENSUS_IMPORT_STATUS:
                return Object.assign({}, state, {
                    censusImporting: action.censusImporting
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
                    stateSelectionParams: action.stateSelectionParams
                })
            case REQUEST_TOP_STATES:
                return Object.assign({}, state, {
                    isFetching: true,
                    didInvalidate: false,
                    stateSelectionParams: action.stateSelectionParams
                })
            case RECEIVE_TOP_STATES:
                return Object.assign({}, state, {
                    isFetching: false,
                    didInvalidate: false,
                    topStates: action.topStates,
                    lastUpdated: action.receivedAt,
                    stateSelectionParams: action.stateSelectionParams
                })
            case CLEAR_COMPLAINT_DETAILS:
                return Object.assign({}, state, {
                    updatePieChartAt: Date.now()
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
            case INVALIDATE_COMPLAINT_DATA:
                return Object.assign({}, state, {
                    companyStateComplaints: [],
                    selectedCompany: null
                })
            case REQUEST_COMPANY_COMPLAINTS:
                return Object.assign({}, state, {
                    companyStateComplaints: [],
                })
            case CLEAR_COMPLAINT_DETAILS:
                return Object.assign({}, state, {
                    companyStateComplaints: [],
                    selectedCompany: null
                })
            case RECEIVE_COMPANY_DETAILS:
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
            case INVALIDATE_COMPLAINT_DATA:
                return Object.assign({}, state, {
                    productStateComplaints: [],
                    selectedProduct: null
                })
            case REQUEST_PRODUCT_COMPLAINTS:
                return Object.assign({}, state, {
                    productStateComplaints: [],
                })
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

const rootReducer = combineReducers({
    selectedTopStatesSortField,
    topStatesReducer,
    stateDetailsReducer,
    stateProfilesReducer,
    companyDetailsReducer,
    productDetailsReducer,
    importStatusReducer
});

export default rootReducer;
