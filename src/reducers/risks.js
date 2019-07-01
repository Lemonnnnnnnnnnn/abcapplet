import {
  RISK_DEFAULT,
  SET_RISK_LIST,
  SET_NEXT_PAGE_RISK_LIST,
} from '@constants/risk'

export default function order(state = RISK_DEFAULT, action) {
  switch (action.type) {
    case SET_RISK_LIST: {
      return { ...action.payload }
    }

    case SET_NEXT_PAGE_RISK_LIST: {
      const { list: oldList } = state
      const { list, total } = action.payload
      return { list: [...oldList, ...list], total }
    }

    default: {
      return state
    }
  }
}
