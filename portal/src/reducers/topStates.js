import { RECEIVE_TOP_STATES, REQUEST_TOP_STATES, INVALIDATE_TOP_STATES } from '../constants/ActionTypes';



function topStates(state = 0, action) {
    const initialState = {
        isFetching: false,
        didInvalidate: false,
        items: []
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

export default function topStatesReducer(state = { }, action) {
    switch (action.type) {
        case INVALIDATE_TOP_STATES:
        case RECEIVE_TOP_STATES:
        case REQUEST_TOP_STATES:
            return Object.assign({}, state, {
                [action.field]: topStates(state[action.field], action)
            })
        default:
            return state
    }
}