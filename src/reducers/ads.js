import { AD_DEFAULT, SET_AD_LIST } from '@constants/ad'


export default function home(state = AD_DEFAULT, action) {
  switch (action.type) {
    case SET_AD_LIST: {
      return [...action.payload]
    }

    default: {
      return state
    }
  }
}
