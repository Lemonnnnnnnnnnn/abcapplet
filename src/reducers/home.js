import { HOME_CITY_LIST, HOME_DEFAULT } from '@constants/home'

export default function home(state = HOME_DEFAULT, action) {
  switch (action.type) {
    case HOME_CITY_LIST: {
      return { ...state, cityList: [...action.payload] }
    }

    default: {
      return state
    }
  }
}
