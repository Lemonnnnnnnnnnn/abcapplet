import { createAction } from '@utils/redux'
import { API_DIST_LIST } from '@constants/api'
import { SET_DIST_LIST } from '@constants/dist'

/**
 * 获取推荐公寓
 * @param {*} payload
 */
export const dispatchDistList = payload => createAction({
  payload: { city: payload },
  method: 'POST',
  type: SET_DIST_LIST,
  url: API_DIST_LIST,
  cb: (res) => res.data.data,
})
