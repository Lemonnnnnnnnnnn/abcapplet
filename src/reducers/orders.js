import {
  ORDER_DEFAULT,
  SET_ORDER_LIST,
  SET_NEXT_PAGE_ORDER_LIST,
} from '@constants/order'

export default function order(state = ORDER_DEFAULT, action) {
  switch (action.type) {
    case SET_ORDER_LIST: {
      return { ...action.payload }
    }

    case SET_NEXT_PAGE_ORDER_LIST: {
      const { list: oldList } = state
      const { list, total } = action.payload
      return { list: [...oldList, ...list], total }
    }

    default: {
      return state
    }
  }
}
