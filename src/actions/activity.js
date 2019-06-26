import { SET_ACTIVITY_LIST } from '@constants/activity'
import { API_ACTIVITY_LIST } from '@constants/api'
import { createAction } from '@utils/redux'
import { PAGE_ACTIVITY_APARTMENT } from '@constants/page'

/**
 * 获取活动列表
 * @param {*} payload
 */
export const dispatchActivityList = payload => createAction({
  payload: { city: payload, type: 'activity' },
  method: 'POST',
  type: SET_ACTIVITY_LIST,
  url: API_ACTIVITY_LIST,
  cb: (res) => res.data.data.list.map(i => ({ ...i, url: `${PAGE_ACTIVITY_APARTMENT}?id=${i.id}` })),
})
