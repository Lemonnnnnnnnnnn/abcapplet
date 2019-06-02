import { ACTIVITY_DEFAULT, SET_ACTIVITY_LIST } from '@constants/activity'

export default function home(state = ACTIVITY_DEFAULT, action) {
  switch (action.type) {
    case SET_ACTIVITY_LIST: {
      return [...action.payload]
    }

    default: {
      return state
    }
  }
}
