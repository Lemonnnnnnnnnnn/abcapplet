import { createAction } from '@utils/redux'

import {
  SET_ORDER_LIST,
  SET_NEXT_PAGE_ORDER_LIST,
} from '@constants/order'

import {
  API_ORDER_LIST,
} from '@constants/api'

/**
 * 获取公寓列表
 * @param {*} payload
 */
export const dispatchOrderList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_ORDER_LIST,
  url: API_ORDER_LIST,
  cb: ({ data: { data } }) => ({ ...data })
})

/**
 * 获取公寓列表下一页
 * @param {*} payload
 */
export const dispatchNextPageOrderList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_NEXT_PAGE_ORDER_LIST,
  url: API_ORDER_LIST,
  cb: ({ data: { data } }) => ({ ...data })
})
