import { HOME_CITY_LIST, HOME_DEFAULT, HOME_CAROUSEL_LIST, HOME_CBD_LIST } from '@constants/home'


export default function home(state = HOME_DEFAULT, action) {
  switch (action.type) {
    case HOME_CITY_LIST: {
      return { ...state, city: [...action.payload] }
    }

    case HOME_CAROUSEL_LIST: {
      return { ...state, carousel: [...action.payload] }
    }

    case HOME_CBD_LIST: {
      return { ...state, cbd: [...action.payload] }
    }

    default: {
      return state
    }
  }
}
