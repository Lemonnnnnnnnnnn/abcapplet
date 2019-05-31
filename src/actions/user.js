import { API_USER_LOGIN } from '@constants/api'
import { createAction } from '@utils/redux'
import Taro from '@tarojs/taro'

import {
  USER_CITY_CODE,
  USER_INFO,
  USER_LOGIN,
  USER_LOGOUT,
  USER_DEFAULT
} from '@constants/user'

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
