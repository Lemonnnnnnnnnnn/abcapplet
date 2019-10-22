import { createAction } from '@utils/redux'
import { API_AD_LIST, API_AD_POPUP_LIST, API_AD_POPUP_LIST_CLOSE } from '@constants/api'
import { SET_AD_LIST, SET_POPUP_AD_LIST, CLOSE_POPUP_AD_LIST } from '@constants/ad'

/**
 * 获取广告列表
 * @param {*} payload
 */
export const dispatchAdList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_AD_LIST,
  url: API_AD_LIST,
  // TODO 格式化 url
  cb: (res) => (res.data ? res.data.data.list : []),
})

// 首页弹窗广告
export const dispatchPopupAdPost = payload => createAction({
  payload,
  method: 'POST',
  type: SET_POPUP_AD_LIST,
  url: API_AD_POPUP_LIST,
})

// 关闭弹窗广告
export const dispatchClosePopupAdPost = payload => createAction({
  payload,
  method: 'POST',
  type: CLOSE_POPUP_AD_LIST,
  url: API_AD_POPUP_LIST_CLOSE,
})
