import { BANNER_DEFAULT, SET_BANNER_LIST } from '@constants/banner'


export default function home(state = BANNER_DEFAULT, action) {
  switch (action.type) {
    case SET_BANNER_LIST: {
      return [...action.payload]
    }

    default: {
      return state
    }
  }
}
