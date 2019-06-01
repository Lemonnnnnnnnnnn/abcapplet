import { SET_CBD_LIST } from '@constants/cbd'
import { API_HOT_CBD_LIST } from '@constants/api'
import { createAction } from '@utils/redux'

/**
 * 获取商圈列表
 */
export const dispatchCBD = payload => createAction({
  payload: { city: payload, },
  method: 'POST',
  type: SET_CBD_LIST,
  url: API_HOT_CBD_LIST,
  cb: (res) => res.data.data.list,
})
