

import {
  APARTMENT_DEFAULT,
  SET_NEXT_PAGE_APARTMENT_LIST_TWO,
  SET_APARTMENT_LIST_TWO,
  UPDATE_APARTMENT_FAVORITE,
  TYPE_SEARCH_APARTMENT,
} from '@constants/apartment'



export default function apartmentsearch(state = APARTMENT_DEFAULT, action) {
  switch (action.type) {
    case SET_APARTMENT_LIST_TWO: {
      const { list, total } = action.payload
      return { list, total, type: TYPE_SEARCH_APARTMENT }
    }

    case SET_NEXT_PAGE_APARTMENT_LIST_TWO: {
      const { list: oldList } = state
      const { list, total } = action.payload
      return { list: [...oldList, ...list], total, type: TYPE_SEARCH_APARTMENT }
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
