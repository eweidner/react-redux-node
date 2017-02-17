import { REQUEST_TOP_STATES, FETCH_TOP_STATES, RECEIVE_TOP_STATES, INVALIDATE_TOP_STATES } from '../constants/ActionTypes';
import { API_HOST } from '../constants/Api';


export function invalidateTopStates(stateQueryParams) {
  return {
    type: INVALIDATE_TOP_STATES,
    stateQueryParams
  }
}

export function requestTopStates(stateQueryParams) {
    console.info("Action: requestTopStates.  Params: " + stateQueryParams)
    return {
        type: REQUEST_TOP_STATES,
        stateQueryParams
    };
}

function receiveTopStates(stateQueryParams, json) {
    console.info("Action: receiveTopStates. json: " + Object.keys(json))
    return {
        type: RECEIVE_TOP_STATES,
        stateQueryParams,
        topStates: json.states.map(child => child.data),
        receivedAt: Date.now()
    }
}


export function fetchTopStates(params) {
    // Chrome dev tools, in networks, shows this is returning good response, but something going wrong.
    var url = `${API_HOST}/api/census/topstates?year=${params.year}&month=${params.month}&field=${params.field}&limit=${params.limit}`;
    return dispatch => {
        dispatch(requestTopStates(params))
        return fetch(url)
            .then(response => response.json())
            .then(json => dispatch(receiveTopStates(params, json)))
    }
}


