import { createAction } from '@utils/redux'
import { API_SUB_LIST, API_SUBLEASE_INDEX, API_CITYCODE_LIST } from '@constants/api'
import { TYPE_SUB_LIST, TYPE_NEXT_PAGE_SUB_LIST, TYPE_SUBLEASE_INDEX, TYPE_CITYCODE_LIST } from '@constants/ad'

/**
 * 获取转租列表
 * @param {*} payload
 */
export const dispatchSubList = payload => createAction({
  payload,
  method: 'GET',
  type: TYPE_SUB_LIST,
  url: API_SUB_LIST,
  // TODO 格式化 url
  cb: (res) => res.data.data,
})

export const dispatchNextPageSubList = payload => createAction({
  payload,
  method: 'GET',
  type: TYPE_NEXT_PAGE_SUB_LIST,
  url: API_SUB_LIST,
  // TODO 格式化 url
  cb: (res) => res.data.data,
})

/**
 * 转租列表首页轮播图，商圈
 * @param {*} payload
 */
export const dispatchSubleaseIndex = payload => createAction({
  payload,
  method: 'GET',
  type: TYPE_SUBLEASE_INDEX,
  url: API_SUBLEASE_INDEX,
  // TODO 格式化 url
  // cb: (res) => res.data.data,
})
/**
 * 获取城市列表
 * @param {*} payload
 */
export const dispatchCityCodeList = payload => createAction({
  payload,
  method: 'GET',
  type: TYPE_CITYCODE_LIST,
  url: API_CITYCODE_LIST,
  cb: (res) => res.data.data,
})
