import { CBD_DEFAULT, SET_CBD_LIST } from '@constants/cbd'


export default function home(state = CBD_DEFAULT, action) {
  switch (action.type) {
    case SET_CBD_LIST: {
      return [...action.payload]
    }

    default: {
      return state
    }
  }
}
