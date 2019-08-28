import {
    GET_HOME_MESSAGE,
    HOME_DEFAULT,
} from '@constants/home'

import { SHOW_ACTIVITY } from '@constants/activity'
import { SHOW_CBD } from '@constants/cbd'



export default function home(state = HOME_DEFAULT, action) {
    switch (action.type) {
        case GET_HOME_MESSAGE: {
            return { ...action.payload }
        }
        case SHOW_ACTIVITY: {
            const index = state.hot_activity.findIndex(i => i.id == action.payload.id)
            if (index === -1) {
                return { ...state, ...action.payload }
            } else {
                state.hot_activity.splice(index, 1, { ...state[index], ...action.payload })
                return { ...state }
            }
        }
        case SHOW_CBD: {
            const index = state.hot_cbd.findIndex(i => i.id == action.payload.id)
            if (index === -1) {
                return { ...state, ...action.payload }
            } else {
                state.hot_cbd.splice(index, 1, { ...state[index], ...action.payload })
                return { ...state }
            }
        }

        default: {
            return state
        }
    }
}
