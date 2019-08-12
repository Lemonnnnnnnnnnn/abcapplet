import {
  USER_CITY_CODE,
  USER_INFO,
  USER_LOGIN,
  USER_LOGOUT,
  USER_DEFAULT,
  GET_USER_PHONE
} from '@constants/user'

export default function user(state = USER_DEFAULT, action) {
  switch (action.type) {
    case USER_CITY_CODE: {
      return { ...state, citycode: action.payload }
    }

    case USER_INFO: {
      return { ...action.payload }
    }

    case USER_LOGIN: {
      return { ...action.payload }
    }

    case USER_LOGOUT: {
      return { ...action.payload }
    }

    default: {
      return state
    }
  }
}
