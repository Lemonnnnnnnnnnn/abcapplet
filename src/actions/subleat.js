import { createAction } from '@utils/redux'
import { API_SUB_LIST } from '@constants/api'
import { TYPE_SUB_LIST,TYPE_NEXT_PAGE_SUB_LIST } from '@constants/ad'

/**
 * 获取转租列表
 * @param {*} payload
 */
export const dispatchSubList = payload => createAction({
  payload,
  method: 'GET',
  type: TYPE_SUB_LIST,
  url:API_SUB_LIST,
  // TODO 格式化 url
  cb: (res) => res.data.data,
})

export const dispatchNextPageSubList = payload => createAction({
  payload,
  method: 'GET',
  type: TYPE_NEXT_PAGE_SUB_LIST,
  url:API_SUB_LIST,
  // TODO 格式化 url
  cb: (res) => res.data.data,
})
