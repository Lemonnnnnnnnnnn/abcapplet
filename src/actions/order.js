import { createAction } from '@utils/redux'

import {
  SHOW_ORDER,
  CREATE_ORDER,
  DELETE_ORDER,
  SET_ORDER_LIST,
  SET_NEXT_PAGE_ORDER_LIST,
} from '@constants/order'

import {
  API_ORDER_LIST,
  API_ORDER_SHOW,
  API_ORDER_DELETE,
  API_ORDER_CREATE,
} from '@constants/api'

/**
 * 获取订单列表
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
 * 获取订单列表下一页
 * @param {*} payload
 */
export const dispatchNextPageOrderList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_NEXT_PAGE_ORDER_LIST,
  url: API_ORDER_LIST,
  cb: ({ data: { data } }) => ({ ...data })
})

/**
 * 获取订单详情
 */
export const dispatchOrderShow = payload => createAction({
  payload,
  method: 'POST',
  type: SHOW_ORDER,
  url: API_ORDER_SHOW,
  cb: ({ data: { data } }) => ({ ...data })
})

/**
 * 取消订单
 */
export const dispatchOrderDelete = payload => createAction({
  payload,
  method: 'POST',
  type: DELETE_ORDER,
  url: API_ORDER_DELETE,
})


/**
 * 创建订单
 */
export const dispatchOrderCreate = payload => createAction({
  payload,
  method: 'POST',
  type: CREATE_ORDER,
  url: API_ORDER_CREATE,
})



