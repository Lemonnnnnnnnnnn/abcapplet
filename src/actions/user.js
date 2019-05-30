import { USER_INFO, USER_LOGIN, USER_LOGOUT, USER_DEFAULT } from '@constants/user'
import { API_USER_LOGIN } from '@constants/api'
import { createAction } from '@utils/redux'
import Taro from '@tarojs/taro'

/**
 * 获取用户信息
 * @param {*} payload
 */
export const dispatchUser = () => {
  return {
    type: USER_INFO, payload: {
      token: Taro.getStorageSync('token') || '',
      ...(Taro.getStorageSync('user_info') || USER_DEFAULT),
    }
  }
}

/**
 * 用户登录
 * @param {*} payload
 */
export const dispatchLogin = ({ payload, fetchOptions }) => createAction({
  payload,
  fetchOptions,
  method: 'POST',
  type: USER_LOGIN,
  url: API_USER_LOGIN,
  cb: () => dispatchUser().payload,
})


/**
 * 用户退出登录
 */
export const dispatchLogout = () => ({
  type: USER_LOGOUT
})
