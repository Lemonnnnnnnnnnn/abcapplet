import {
  SUB_DEFAULT,
  TYPE_SUB_LIST,
  TYPE_NEXT_PAGE_SUB_LIST
} from '@constants/ad'

export default function sublet(state = SUB_DEFAULT, action) {
  switch (action.type) {
    case TYPE_SUB_LIST: {
      return { ...action.payload }
    }

    case TYPE_NEXT_PAGE_SUB_LIST: {
      const { list: oldList } = state
      const { list, total, type } = action.payload
      return { list: [...oldList, ...list], total, type }
    }

    default: {
      return state
    }
  }
}
