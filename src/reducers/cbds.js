import { CBD_DEFAULT, SET_CBD_LIST, SHOW_CBD } from '@constants/cbd'

export default function home(state = CBD_DEFAULT, action) {
  switch (action.type) {
    case SET_CBD_LIST: {
      return [...action.payload]
    }

    case SHOW_CBD: {
      const index = state.findIndex(i => i.id == action.payload.id)
      if (index === -1) {
        return [...action.payload]
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
