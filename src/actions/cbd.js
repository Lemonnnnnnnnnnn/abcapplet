import { createAction } from '@utils/redux'

import { SHOW_CBD, SET_CBD_LIST } from '@constants/cbd'
import { PAGE_CBD_APARTMENT } from '@constants/page'
import { API_HOT_CBD_LIST, API_CBD_SHOW } from '@constants/api'

/**
 * 获取商圈列表
 */
export const dispatchCbdList = payload => createAction({
  payload: { city: payload, },
  method: 'POST',
  type: SET_CBD_LIST,
  url: API_HOT_CBD_LIST,
  cb: (res) => res.data.data.list.map(i => ({ ...i, url: `${PAGE_CBD_APARTMENT}?id=${i.id}` }))
})

/**
 * 获取商圈详情
 */
export const dispatchCbdShow = payload => createAction({
  payload,
  method: 'POST',
  type: SHOW_CBD,
  url: API_CBD_SHOW,
  // TODO 这里后端单词打错了
  cb: ({ data: { data } }) => ({ ...data.cbd, id: payload.cbd, url: `${PAGE_CBD_APARTMENT}?id=${payload.cbd}` })
})
