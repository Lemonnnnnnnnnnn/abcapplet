import {
  APARTMENT_DEFAULT,
  SET_APARTMENT_LIST,
  UPDATE_APARTMENT_FAVORITE,
  SET_NEXT_PAGE_APARTMENT_LIST,
  APARTMENT_URL_DIST,
  TYPE_SETTING_RISK_POST
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

export default function apartment(state = APARTMENT_DEFAULT, action) {
  switch (action.type) {
    case SET_APARTMENT_LIST: {
      const { list, total, type } = action.payload
      return { ...state, list: formatList(list, type), total, type }
    }

    case SET_NEXT_PAGE_APARTMENT_LIST: {
      const { list: oldList } = state
      const { list, total, type } = action.payload
      return { ...state, list: [...oldList, ...list], total, type }
    }

    case UPDATE_APARTMENT_FAVORITE: {
      let { list } = state
      const { id } = action.payload

      list = list.map(i =>
        i.id === id ? { ...i, is_collect: !i.is_collect } : i
      )

      return { ...state, list }
    }

    case TYPE_SETTING_RISK_POST: {
      const { people_num, sum } = action.payload
      return { ...state, people_num, sum }
    }

    default: {
      return state
    }
  }
}
