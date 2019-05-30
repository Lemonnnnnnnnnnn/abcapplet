import { USER_INFO, USER_LOGIN, USER_LOGOUT, USER_DEFAULT } from '@constants/user'

export default function user(state = USER_DEFAULT, action) {
  switch (action.type) {
    case USER_INFO: {
      return { ...state, userInfo: { ...action.payload } }
    }

    case USER_LOGIN: {
      return { ...state, userInfo: { ...action.payload } }
    }

    case USER_LOGOUT: {
      return { ...USER_DEFAULT }
    }

    default: {
      return state
    }
  }
}
