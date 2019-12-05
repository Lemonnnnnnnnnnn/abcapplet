import Taro from '@tarojs/taro'
import { createAction } from '@utils/redux'

import {
  API_USER_LOGIN,
  API_USER_FAVORITE_DELETE,
  API_USER_FAVORITE_CREATE,
  API_USER_MSG,
  API_USER_FEEDBACK,

  API_DEMAND_CREATE,
  API_DEMAND_CHECK,

  API_AUTH_MOBILEPOST,

  API_COUPON_RECEIVECODE,
  API_COUPON_USER,
  API_COUPON_ALONE,
  API_SETTING_CITY,
  API_USER_ACTIVITY
} from '@constants/api'

import {
  USER_INFO,
  USER_LOGIN,
  USER_LOGOUT,
  USER_DEFAULT,
  USER_CITY_CODE,
  TYPE_DEMAND_CREATE,
  TYPE_DEMAND_CHECK,
  TYPE_USER_FEEDBACK,

  GET_USER_PHONE,

  TYPE_COUPON_RECEIVECODEPOST,
  TYPE_NEXTPAGE_COUPON_USERPOST,
  TYPE_COUPON_USERPOST,
  TYPE_GET_COUPON_DETAILPOST,
  TYPE_GET_USER_ACTIVITY,
  TYPE_GET_NEXTPAGE_USER_ACTIVITY,
  SET_USER_CITY

} from '@constants/user'

import {
  UPDATE_APARTMENT_FAVORITE,
} from '@constants/apartment'

import {
  UPDATE_ROOM_FAVORITE
} from '@constants/room'

/**
 * 更新用户 Storage
 * @param {*} userInfo
 */
export const setUserStorage = (userInfo = {}) => {
  const oldUserInfo = getUserStorage()

  userInfo = { ...oldUserInfo, ...userInfo }
  Taro.setStorageSync('user_info', userInfo)

  return userInfo
}

/**
 * 获取用户 Storage
 * @param {*} userInfo
 */
export const getUserStorage = () => ({
  ...(Taro.getStorageSync('user_info') || USER_DEFAULT.userInfo),
})

/**
 * 清除用户 Storage
 * @param {*} key
 */
export const clearUserStorage = () => Taro.setStorageSync('user_info', '')

/**
 * 用户信息
 * @param {*} payload
 */
export const dispatchUser = () => ({
  type: USER_INFO,
  payload: getUserStorage(),
})

/**
 * 用户所在城市信息
 * @param {*} payload
 */
export const dispatchUserCity = payload => {
  setUserStorage({ citycode: payload })

  return {
    type: USER_CITY_CODE,
    payload,
  }
}

/**
 * 用户登录
 * @param {*} payload
 */
export const dispatchLogin = (payload, fetchOptions = {}) => createAction({
  payload,
  fetchOptions,
  method: 'POST',
  type: USER_LOGIN,
  url: API_USER_LOGIN,
  cb: ({ data: { data: { user, token } } }) => setUserStorage({ ...user, token })
})


/**
 * 用户退出登录
 */
export const dispatchLogout = () => ({
  type: USER_LOGOUT,
  payload: USER_DEFAULT.userInfo
})


/**
 * 删除心愿
 */
export const dispatchFavoriteDelete = (payload) => {
  let type, cb

  if (payload.id) {
    type = UPDATE_APARTMENT_FAVORITE
    cb = () => ({ id: payload.id })
  }

  if (payload.type_id) {
    type = UPDATE_APARTMENT_FAVORITE
    cb = () => ({ id: payload.type_id })
  }

  if (payload.room_id) {
    type = UPDATE_ROOM_FAVORITE
    cb = () => ({ id: payload.room_id })
  }

  return createAction({
    cb,
    type,
    payload,
    method: 'POST',
    url: API_USER_FAVORITE_DELETE,
  })
}

/**
 * 增加心愿单
 */
export const dispatchFavoriteCreate = (payload) => {
  let type, cb

  if (payload.id) {
    type = UPDATE_APARTMENT_FAVORITE
    cb = () => ({ id: payload.id })
  }

  if (payload.type_id) {
    type = UPDATE_APARTMENT_FAVORITE
    cb = () => ({ id: payload.type_id })
  }

  if (payload.room_id) {
    type = UPDATE_ROOM_FAVORITE
    cb = () => ({ id: payload.room_id })
  }

  return createAction({
    cb,
    type,
    payload,
    method: 'POST',
    url: API_USER_FAVORITE_CREATE,
  })
}
/**
 * 提交需求卡
 * @param {*} payload
 */
export const dispatchRequirementCreate = (payload) => createAction({
  payload,
  method: 'POST',
  type: TYPE_DEMAND_CREATE,
  url: API_DEMAND_CREATE,
})
/**
 * 判断用户已弹过引导框
 * @param {*} payload
 */
export const dispatchRequirementCheck = (payload) => createAction({
  payload,
  method: 'POST',
  type: TYPE_DEMAND_CHECK,
  url: API_DEMAND_CHECK,
})

export const dispatchGetUserMsg = (payload) => createAction({
  payload,
  method: 'POST',
  type: "getUserMsg",
  url: API_USER_MSG
})

// 获取手机号码
export const dispatchUserPhone = (payload) => createAction({
  payload,
  method: 'POST',
  type: GET_USER_PHONE,
  url: API_AUTH_MOBILEPOST,
})
//用户反馈意见
export const dispatchFeedBack = (payload) => createAction({
  payload,
  method: 'POST',
  type: TYPE_USER_FEEDBACK,
  url: API_USER_FEEDBACK
})

// 兑换码获取优惠券
export const dispatchCouponReceiveCode = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_COUPON_RECEIVECODEPOST,
  url: API_COUPON_RECEIVECODE
})

// 获取用户名下优惠券
export const dispatchCouponUser = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_COUPON_USERPOST,
  url: API_COUPON_USER,
  cb: ({ data: { data } }) => data
})

// 获取下一页用户下优惠券
export const dispatchNextPageCouponUser = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_NEXTPAGE_COUPON_USERPOST,
  url: API_COUPON_USER,
  cb: ({ data: { data } }) => data
})

// 获取单一优惠券详情
export const dispatchCouponAlone = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_GET_COUPON_DETAILPOST,
  url: API_COUPON_ALONE,
})


// 设置用户所在站点
export const dispatchSetCity = payload => createAction({
  payload,
  method: 'POST',
  type: SET_USER_CITY,
  url: API_SETTING_CITY
})

// 获取用户活动
export const dispatchUserActivity = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_GET_USER_ACTIVITY,
  url: API_USER_ACTIVITY,
  cb: ({ data: { data } }) => data
})

export const dispatchNextPageUserActivity = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_GET_NEXTPAGE_USER_ACTIVITY,
  url: API_USER_ACTIVITY,
  cb: ({ data: { data } }) => data
})
