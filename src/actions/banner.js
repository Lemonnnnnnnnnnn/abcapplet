import { SET_BANNER_LIST } from '@constants/banner'
import { API_BANNER_LIST } from '@constants/api'
import { createAction } from '@utils/redux'

/**
 * 获取轮播列表
 * @param {*} payload
 */
export const dispatchBanner = payload => createAction({
  payload: { city: payload, type: 'basic' },
  method: 'POST',
  type: SET_BANNER_LIST,
  url: API_BANNER_LIST,
  cb: (res) => res.data.data.list,
})
