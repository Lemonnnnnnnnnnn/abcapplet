import {
  APARTMENT_DEFAULT,
  SET_APARTMENT_LIST,
  UPDATE_APARTMENT_FAVORITE,
  SET_NEXT_PAGE_APARTMENT_LIST,
} from '@constants/apartment'

export default function home(state = APARTMENT_DEFAULT, action) {
  switch (action.type) {
    case SET_APARTMENT_LIST: {
      return { ...action.payload }
    }

    case SET_NEXT_PAGE_APARTMENT_LIST: {
      const { list: oldList } = state
      const { list, total, type } = action.payload
      return { list: [...oldList, ...list], total, type }
    }

    case UPDATE_APARTMENT_FAVORITE: {
      let { list } = state
      const { id } = action.payload

      list = list.map(i =>
        i.id === id ? { ...i, is_collect: !i.is_collect } : i
      )

      return { ...state, list }
    }

    default: {
      return state
    }
  }
}
