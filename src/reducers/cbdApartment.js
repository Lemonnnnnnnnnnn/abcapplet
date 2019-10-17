import {
  APARTMENT_DEFAULT,
  APARTMENT_URL_DIST,
  SET_CBD_APARTMENT_LIST,
  SET_NEXT_PAGE_CBD_APARTMENT_LIST,
  UPDATE_APARTMENT_FAVORITE,
} from '@constants/apartment'

const formatList = (list, type) => {
  return list = list.map(i => formatItem(i, type))
}

const formatItem = (item, type) => {
  return {
    ...item,
    url: `${APARTMENT_URL_DIST[type]}?id=${item.id}`
  }
}

export default function cbdApartment(state = APARTMENT_DEFAULT, action) {
  switch (action.type) {
    case SET_CBD_APARTMENT_LIST: {
      const { list, total, type } = action.payload
      return { list: formatList(list, type), total, type }
    }
    case SET_NEXT_PAGE_CBD_APARTMENT_LIST: {
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
