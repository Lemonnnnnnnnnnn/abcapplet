import {
  ORDER_DEFAULT,
  SHOW_ORDER,
  SET_ORDER_LIST,
  SET_NEXT_PAGE_ORDER_LIST,

  ORDER_PAY_WAITING,
  ORDER_STATUS_PAY_WAITING,
  ORDER_STATUS_LOCK_WAITING,
} from '@constants/order'
import { pipeline } from 'stream';

const formatList = (list) => {
  return list = list.map(i => formatItem(i))
}

const formatItem = (item) => {
  const isPayWaiting = (item.status === ORDER_STATUS_LOCK_WAITING && item.paid === ORDER_PAY_WAITING)

  return {
    ...item,
    status: isPayWaiting ? ORDER_STATUS_PAY_WAITING : item.status
  }
}

export default function order(state = ORDER_DEFAULT, action) {
  switch (action.type) {
    case SET_ORDER_LIST: {
      let { list, total } = action.payload

      // 当状态为待锁定且付款时修改数据

      return { list: formatList(list), total }
    }

    case SET_NEXT_PAGE_ORDER_LIST: {
      const { list: oldList } = state
      const { list, total } = action.payload
      return { list: formatList([...oldList, ...list]), total }
    }

    case SHOW_ORDER: {
      let { list } = state
      const index = list.findIndex(i => i.id == action.payload.id)

      if (index === -1) {
        const newList = [...list, action.payload]
        return { list: formatList([...list, action.payload]), total: newList.length }
      } else {
        list.splice(index, 1, { ...list[index], ...action.payload })
        const newList = [...list]
        return { list: formatList([...list]), total: newList.length }
      }
    }

    default: {
      return state
    }
  }
}
