import {  REQUEST_TOP_STATES, FETCH_TOP_STATES, RECEIVE_TOP_STATES,
    INVALIDATE_TOP_STATES, SELECT_SORTFIELD,
    REQUEST_COMPANY_COMPLAINTS, RECEIVE_COMPANY_COMPLAINTS, REQUEST_PRODUCT_COMPLAINTS,
    RECEIVE_PRODUCT_COMPLAINTS, REQUEST_STATE_PROFILES, RECEIVE_STATE_PROFILES,
    SWITCH_UI_TO_STATE_CENTRIC, SWITCH_UI_TO_PRODUCT_CENTRIC, SWITCH_UI_TO_COMPANY_CENTRIC,
    RECEIVE_COMPANY_DETAILS, RECEIVE_PRODUCT_DETAILS, REQUEST_COMPANY_DETAILS, REQUEST_PRODUCT_DETAILS,
    CLEAR_COMPLAINT_DETAILS, INVALIDATE_COMPLAINT_DATA, RECEIVE_COMPLAINTS_IMPORT_STATUS, RECEIVE_CENSUS_IMPORT_STATUS,
    REQUEST_COMPLAINT_IMPORT_STATUS, REQUEST_CENSUS_IMPORT_STATUS
} from '../constants/ActionTypes';

import { API_HOST } from '../constants/Api';



export function invalidateTopStates(stateQueryParams) {
  return {
    type: INVALIDATE_TOP_STATES,
    stateSelectionParams
  }
}

export function invalidateComplaintData() {
    return {
        type: INVALIDATE_COMPLAINT_DATA
    }
}


export function selectSortFieldAction(sortField) {
  return {
    type: SELECT_SORTFIELD,
    sortField
  }
}

export function requestTopStates(stateSelectionParams) {
    console.info("TopStatesActions.requestTopStates. params: " + Object.keys(stateSelectionParams))
    return {
        type: REQUEST_TOP_STATES,
      stateSelectionParams
    };
}

function receiveTopStates(stateSelectionParams, json) {
    var topStates = json.states;
    console.info("TopStatesActions.receiveTopStates. json: " + Object.keys(json))
    return {
        type: RECEIVE_TOP_STATES,
        stateSelectionParams,
        topStates: topStates,
        receivedAt: Date.now()
    }
}

export function fetchTopStates(params) {
    console.info("TopStatesActions.fetchTopStates invoked");
    var url = `${API_HOST}/api/census/topstates?year=${params.year}&month=${params.month}&field=${params.field}&limit=${params.limit}`;
    return dispatch => {
        dispatch(requestTopStates(params))
        return fetch(url)
            .then(response => response.json())
            .then(json => dispatch(receiveTopStates(params, json)))
    }
}


export function requestProductComplaints(selectedStateCode) {
  console.info("TopStatesActions.requestComplaintProducts. params: " + selectedStateCode)
  return {
    type: REQUEST_PRODUCT_COMPLAINTS,
    selectedStateCode
  }
};

function receiveStateProductComplaints(productQueryParams, json) {
  var productComplaints = json.products;
  console.info("TopStatesActions.receiveProductComplaints. json: " + Object.keys(json))
  return {
    type: RECEIVE_PRODUCT_COMPLAINTS,
    productComplaints,
    productQueryParams,
    receivedAt: Date.now()
  }
}

export function showStateProductComplaints(selectedStateCode) {
    var params = { limit: 10, year: 2013, month: 1, months: 36, state: selectedStateCode };

    var url = `${API_HOST}/api/complaints/products?year=${params.year}&month=${params.month}&months=${params.months}&state=${params.state}&limit=${params.limit}`;
    return dispatch => {
        dispatch(requestProductComplaints(selectedStateCode))
        return fetch(url)
          .then(response => response.json())
          .then(json => dispatch(receiveStateProductComplaints(params, json)))
    }
}

export function requestCompanyComplaints(selectedStateCode) {
  console.info("TopStatesActions.requestCompanyComplaints. params: " + selectedStateCode)
  return {
    type: REQUEST_COMPANY_COMPLAINTS,
    selectedStateCode
  };
}

function receiveStateCompanyComplaints(companyQueryParams, json) {
  var companyComplaints = json.companies;
  console.info("TopStatesActions.receiveTopStates. json: " + Object.keys(json))
  return {
    type: RECEIVE_COMPANY_COMPLAINTS,
    companyComplaints,
    companyQueryParams,
    receivedAt: Date.now()
  }
}

export function showStateCompanyComplaints(selectedStateCode) {
  var params = { limit: 10, year: 2013, month: 1, months: 36, state: selectedStateCode };
  var url = `${API_HOST}/api/complaints/companies?year=${params.year}&month=${params.month}&months=${params.months}&state=${params.state}&limit=${params.limit}`;
  return dispatch => {
    dispatch(requestCompanyComplaints(selectedStateCode))
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(receiveStateCompanyComplaints(params, json)))
  }
}


export function closeComplaintDetails() {
  return {
    type: CLEAR_COMPLAINT_DETAILS
  };

}

export function requestStateProfiles() {
  console.info("TopStatesActions.requestStateProfiles.")
  return {
    type: REQUEST_STATE_PROFILES
  };
}

function receiveStateProfiles(json) {
  var stateProfiles = json.states;
  return {
    type: RECEIVE_STATE_PROFILES,
    stateProfiles,
    stateProfilesReceivedAt: Date.now()
  }
}

export function fetchStateProfiles(selectedStateCode) {
  var url = `${API_HOST}/api/states`;
  return dispatch => {
    dispatch(requestStateProfiles())
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(receiveStateProfiles(json)))
  }

}

//----------------------------------------------------------------------------------------
//  Company Details
export function requestCompanyDetails(companySelectionParams) {
  return {
    type: REQUEST_COMPANY_DETAILS,
    companySelectionParams
  };
}

function receiveCompanyDetails(companySelectionParams, json) {
  var companyStateComplaints = json.states;
  console.info("TopStatesActions.receiveTopStates. json: " + Object.keys(json))
  return {
    type: RECEIVE_COMPANY_DETAILS,
    companySelectionParams,
    companyStateComplaints,
    receivedAt: Date.now()
  }
}

export function fetchCompanyDetails(params) {
    var encCompany = encodeURIComponent(params.company);
    var url = `${API_HOST}/api/complaints/states?year=${params.year}&months=${params.months}&month=${params.month}&company=${encCompany}&limit=${params.limit}`;
    return dispatch => {
          dispatch(requestCompanyDetails(params))
          return fetch(url)
              .then(response => response.json())
              .then(json => dispatch(receiveCompanyDetails(params, json)))
      }
}


//----------------------------------------------------------------------------------------
//  Product Details
export function requestProductDetails(productSelectionParams) {
  return {
    type: REQUEST_PRODUCT_DETAILS,
    productSelectionParams
  };
}

function receiveProductDetails(productSelectionParams, json) {
  var productStateComplaints = json.states;
  return {
    type: RECEIVE_PRODUCT_DETAILS,
    productSelectionParams,
    productStateComplaints,
    receivedAt: Date.now()
  }
}

export function fetchProductDetails(params) {
    var encProduct = encodeURIComponent(params.product);
    var url = `${API_HOST}/api/complaints/states?year=${params.year}&months=${params.months}&month=${params.month}&product=${encProduct}&limit=${params.limit}`;
    return dispatch => {
      dispatch(requestProductDetails(params))
      return fetch(url)
        .then(response => response.json())
        .then(json => dispatch(receiveProductDetails(params, json)))
    }
}


function receiveCensusImportStatus(json) {
    var censusImporting = json['importing'];
    return {
        type: RECEIVE_CENSUS_IMPORT_STATUS,
        censusImporting
    }
}

function requestCensusImportStatus() {
    return {
        type: REQUEST_CENSUS_IMPORT_STATUS,
    }
}


export function fetchCensusImportStatus() {
    var url = `${API_HOST}/api/census/import/status`;
    return dispatch => {
        dispatch(requestCensusImportStatus())
        return fetch(url)
            .then(response => response.json())
            .then(json => dispatch(receiveCensusImportStatus(json)))
    }
}

function receiveComplaintsImportStatus(json) {
    var complaintsImporting = json['importing'];
    return {
        type: RECEIVE_COMPLAINTS_IMPORT_STATUS,
        complaintsImporting
    }
}


function requestComplaintsImportStatus() {
    return {
        type: REQUEST_COMPLAINT_IMPORT_STATUS,
    }
}

export function fetchComplaintsImportStatus() {
    var url = `${API_HOST}/api/complaints/import/status`;
    return dispatch => {
        dispatch(requestComplaintsImportStatus())
        return fetch(url)
            .then(response => response.json())
            .then(json => dispatch(receiveComplaintsImportStatus(json)))
    }
}


