import {
  ACTIVITY_DEFAULT,
  SET_ACTIVITY_LIST,
  SHOW_ACTIVITY
} from '@constants/activity'

export default function home(state = ACTIVITY_DEFAULT, action) {
  switch (action.type) {
    case SET_ACTIVITY_LIST: {
      return [...action.payload]
    }

    case SHOW_ACTIVITY: {
      const index = state.findIndex(i => i.id == action.payload.id)

      if (index === -1) {
        return [...state, action.payload]
      } else {
        state.splice(index, 1, { ...state[index], ...action.payload })
        return [...state]
      }
    }

    default: {
      return state
    }
  }
}
