import { REQUEST_TOP_STATES, FETCH_TOP_STATES, RECEIVE_TOP_STATES, INVALIDATE_TOP_STATES } from '../constants/ActionTypes';


export function invalidateSubreddit(params) {
  return {
    type: INVALIDATE_TOP_STATES,
    subreddit
  }
}

export function requestTopStates() {
  return {
    type: REQUEST_TOP_STATES
  };
}

function receiveTopStates(params, json) {
    return {
        type: RECEIVE_TOP_STATES,
        sortField,
        states: json.states.children.map(child => child.data),
        receivedAt: Date.now()
    }
}

//var result = fetch(`/api/census/topstates?year=${params.year}&month=${params.month}&field=${params.field}&limit=${params.limit}`);
function fetchTopStates(params) {
    return dispatch => {
        dispatch(requestTopStates(params))
        return fetch(`http://localhost:3000/api/census/topstates?year=${params.year}&month=${params.month}&field=${params.field}&limit=${limit`)
            .then(response => response.json())
            .then(json => dispatch(receiveTopStates(params, json)))
    }
}


