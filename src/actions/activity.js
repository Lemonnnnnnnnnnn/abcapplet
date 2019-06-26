import { createAction } from '@utils/redux'

import { PAGE_ACTIVITY_APARTMENT } from '@constants/page'
import { SET_ACTIVITY_LIST, SHOW_ACTIVITY } from '@constants/activity'
import { API_ACTIVITY_LIST, API_ACTIVITY_SHOW } from '@constants/api'


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


/**
 * 获取活动详情
 */
export const dispatchActivityShow = payload => createAction({
  payload,
  method: 'POST',
  type: SHOW_ACTIVITY,
  url: API_ACTIVITY_SHOW,
  cb: ({ data: { data } }) => ({ ...data.hot_rule, url: `${PAGE_ACTIVITY_APARTMENT}?id=${payload.id}` })
})
