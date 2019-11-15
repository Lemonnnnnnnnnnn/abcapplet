import { createAction } from '@utils/redux'
import {
  TYPE_BARGAIN_LIST,
  TYPE_NEXTPAGE_BARGAIN_LIST,
  TYPE_BARGAIN_GET_COUPON,
  TYPE_BARGAIN_HELP_CUT,
  TYPE_BARGAIN_CUT,
  TYPE_BARGAIN_DETAIL
} from '@constants/bargain'
import {
  API_BARGAIN_LIST,
  API_BARGAIN_DETAIL,
  API_BARGAIN_CUT,
  API_BARGAIN_HELP_CUT,
  API_BARGAIN_GET_COUPON
} from '@constants/api'

// 获取砍价列表
export const dispatchBargainList = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_BARGAIN_LIST,
  url: API_BARGAIN_LIST,
  cb: ({ data: { data } }) => data
})

// 获取砍价列表下一页
export const dispatchNextPageBargainList = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_NEXTPAGE_BARGAIN_LIST,
  url: API_BARGAIN_LIST,
  cb: ({ data: { data } }) => data
})

// 砍价详情
export const dispatchBargainDetail = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_BARGAIN_DETAIL,
  url: API_BARGAIN_DETAIL,
  cb: ({ data: { data } }) => data
})

// 发起砍价
export const dispatchBargainCut = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_BARGAIN_CUT,
  url: API_BARGAIN_CUT,
  cb: res => res && res.data && res.data.data
})

// 帮砍
export const dispatchBargainHelpCut = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_BARGAIN_HELP_CUT,
  url: API_BARGAIN_HELP_CUT,
  cb: res => res && res.data && res.data.data
})

// 领取优惠券
export const dispatchBargainGetCoupon = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_BARGAIN_GET_COUPON,
  url: API_BARGAIN_GET_COUPON,
  cb: res => res && res.data && res.data.data
})
