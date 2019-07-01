import {
  ORDER_DEFAULT,
  SHOW_ORDER,
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

    case SHOW_ORDER: {
      let { list } = state
      const index = list.findIndex(i => i.id == action.payload.id)

      if (index === -1) {
        const newList = [...list, action.payload]
        return { list: [...list, action.payload], total: newList.length }
      } else {
        list.splice(index, 1, { ...list[index], ...action.payload })
        const newList = [...list]
        return { list: [...list], total: newList.length }
      }
    }

    default: {
      return state
    }
  }
}
