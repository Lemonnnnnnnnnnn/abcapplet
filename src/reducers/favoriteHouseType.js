import {
  APARTMENT_DEFAULT,
  SET_FAVORITE_HOUSETYPE_LIST,
  SET_NEXT_PAGE_FAVORITE_HOUSETYPE_LIST,
  APARTMENT_URL_DIST
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

export default function housetype(state = APARTMENT_DEFAULT ,action) {
  switch (action.type) {
    case SET_FAVORITE_HOUSETYPE_LIST: {
      const { list, total, type } = action.payload
      return { list: formatList(list, type), total, type }
    }

    case SET_NEXT_PAGE_FAVORITE_HOUSETYPE_LIST: {
      const { list: oldList } = state
      const { list, total, type } = action.payload
      return { list: [...oldList, ...list], total, type }
    }



    default: {
      return state
    }
  }
}
