import { DIST_DEFAULT, SET_DIST_LIST } from '@constants/dist'

export default function home(state = DIST_DEFAULT, action) {
  switch (action.type) {
    case SET_DIST_LIST: {
      return { ...action.payload }
    }

    default: {
      return state
    }
  }
}
