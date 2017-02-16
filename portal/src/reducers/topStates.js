import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../constants/ActionTypes';

export default function counter(state = 0, action) {

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
                    items: action.posts,
                    lastUpdated: action.receivedAt
                })
            default:
                return state
        }
    }

}
