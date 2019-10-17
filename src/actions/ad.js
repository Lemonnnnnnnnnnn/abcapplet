import { createAction } from '@utils/redux'
import { API_AD_LIST } from '@constants/api'
import { SET_AD_LIST } from '@constants/ad'

/**
 * 获取广告列表
 * @param {*} payload
 */
export const dispatchAdList = payload => createAction({
  payload: { city: payload },
  method: 'POST',
  type: SET_AD_LIST,
  url: API_AD_LIST,
  // TODO 格式化 url
  cb: (res) => (res.data ? res.data.data.list : []),
})
