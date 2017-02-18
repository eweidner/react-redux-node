import {  REQUEST_TOP_STATES, FETCH_TOP_STATES, RECEIVE_TOP_STATES,
  INVALIDATE_TOP_STATES, SELECT_SORTFIELD,
  REQUEST_COMPANY_COMPLAINTS, RECEIVE_COMPANY_COMPLAINTS, REQUEST_PRODUCT_COMPLAINTS,
  RECEIVE_PRODUCT_COMPLAINTS, REQUEST_STATE_PROFILES, RECEIVE_STATE_PROFILES } from '../constants/ActionTypes';

import { API_HOST } from '../constants/Api';



export function invalidateTopStates(stateQueryParams) {
  return {
    type: INVALIDATE_TOP_STATES,
    stateQueryParams
  }
}


export function selectSortFieldAction(sortField) {
  return {
    type: SELECT_SORTFIELD,
    sortField
  }
}

export function requestTopStates(stateQueryParams) {
    console.info("TopStatesActions.requestTopStates. params: " + Object.keys(stateQueryParams))
    return {
        type: REQUEST_TOP_STATES,
        stateQueryParams
    };
}

function receiveTopStates(stateQueryParams, json) {
    var topStates = json.states;
    console.info("TopStatesActions.receiveTopStates. json: " + Object.keys(json))
    return {
        type: RECEIVE_TOP_STATES,
        stateQueryParams,
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


export function requestStateProfiles() {
  console.info("TopStatesActions.requestStateProfiles.")
  return {
    type: REQUEST_STATE_PROFILES
  };
}

function receiveStateProfiles(json) {
  var stateProfiles = json.states;
  console.info("TopStatesActions.receiveTopStates. json: " + Object.keys(json))
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

