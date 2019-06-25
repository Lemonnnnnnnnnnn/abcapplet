import {
  APARTMENT_DEFAULT,
  SET_APARTMENT_LIST,
  SET_NEXT_PAGE_APARTMENT_LIST
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

    default: {
      return state
    }
  }
}
