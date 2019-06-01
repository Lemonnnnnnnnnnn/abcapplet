import { CITY_DEFAULT, SET_CITY_LIST } from '@constants/city'


export default function home(state = CITY_DEFAULT, action) {
  switch (action.type) {
    case SET_CITY_LIST: {
      return [...action.payload]
    }

    default: {
      return state
    }
  }
}
