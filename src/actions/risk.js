import { createAction } from '@utils/redux'

import {
  CREATE_RISK,
  SET_RISK_LIST,
  SET_NEXT_PAGE_RISK_LIST,
} from '@constants/risk'

import {
  API_RISK_LIST,
  API_RISK_CREATE,
} from '@constants/api'

/**
 * 获取风险列表
 * @param {*} payload
 */
export const dispatchRiskList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_RISK_LIST,
  url: API_RISK_LIST,
  cb: ({ data: { data } }) => ({ ...data })
})

/**
 * 获取风险列表下一页
 * @param {*} payload
 */
export const dispatchNextPageRiskList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_NEXT_PAGE_RISK_LIST,
  url: API_RISK_LIST,
  cb: ({ data: { data } }) => ({ ...data })
})

/**
 * 创建订单
 */
export const dispatchRiskCreate = payload => createAction({
  payload,
  method: 'POST',
  type: CREATE_RISK,
  url: API_RISK_CREATE,
})



