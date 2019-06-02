import { RECOMMEND_DEFAULT, SET_RECOMMEND_LIST } from '@constants/recommend'

export default function home(state = RECOMMEND_DEFAULT, action) {
  switch (action.type) {
    case SET_RECOMMEND_LIST: {
      return [...action.payload]
    }

    default: {
      return state
    }
  }
}
