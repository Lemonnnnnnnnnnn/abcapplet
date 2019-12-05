import { TYPE_BARGAIN_LIST, TYPE_NEXTPAGE_BARGAIN_LIST } from '@constants/bargain'

export default function bargainReducer(state = {}, action) {
  switch (action.type) {
    case TYPE_BARGAIN_LIST: {
      const { list, total } = action.payload
      return { ...state, list, total }
    }
    case TYPE_NEXTPAGE_BARGAIN_LIST: {
      const { list: oldList } = state
      const { list, total } = action.payload
      return { ...state, list: [...oldList, ...list], total }
    }
    default: {
      return state
    }
  }
}
