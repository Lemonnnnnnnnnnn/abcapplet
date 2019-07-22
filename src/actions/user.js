import Taro from '@tarojs/taro'
import { createAction } from '@utils/redux'

import {
  API_USER_LOGIN,
  API_USER_FAVORITE_DELETE,
  API_USER_FAVORITE_CREATE,
  API_DEMAND_CREATE,
} from '@constants/api'

import {
  USER_INFO,
  USER_LOGIN,
  USER_LOGOUT,
  USER_DEFAULT,
  USER_CITY_CODE,
  TYPE_DEMAND_CREATE,
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
  type:TYPE_DEMAND_CREATE,
  url: API_DEMAND_CREATE,
})
