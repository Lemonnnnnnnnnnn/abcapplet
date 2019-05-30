import Taro from '@tarojs/taro'
import { API_USER_LOGIN } from '@constants/api'
import { MESSAGE_ERROR } from '@constants/message'

/**
 * 响应状态码
 */
const CODE_SUCCESS = 1
const CODE_ERROR = 2003
const CODE_AUTH_EXPIRED = 911

/**
 * 开发环境配置
 */
const DEV_REQUEST_DELAY = 2000
const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * 封装 storage
 * 当无数据时返回空字符
 * @param {*} key
 */
function getStorage(key) {
  return Taro.getStorage({ key })
    .then(res => res.data)
    .catch(() => '')
}

/**
 * 封装 storage
 * 更新用户数据
 * @param {*} key
 */
function updateStorage(data = {}) {
  return Promise.all([
    Taro.setStorageSync('token', data.token || ''),
    Taro.setStorageSync('user_info', data.user || ''),
  ])
}

/**
 * 网络请求封装
 * @param {*} options
 */
export default async function fetch({
  url,
  payload,
  method = 'GET',
  showToast = true,
  autoLogin = true,
  showLoading = true,
  success = () => { },
  fail = () => { },
  complete = () => { },
}) {
  // 初始化头部数据
  const header = {}
  const token = await getStorage('token')
  const data = { ...payload, token }

  /**
   * 修改请求头
   */
  if (method === 'POST') {
    header['Content-Type'] = 'application/json'
  }

  /**
   * 当网络请求成功
   * 开发环境增加模拟请求延迟
   * @param {*} response
   */
  async function handleSuccess(response) {
    if (url === API_USER_LOGIN) {
      let { token: newToken, user } = response.data.data
      await updateStorage({ token: newToken, user })
    }

    return setTimeout(() => success(response), IS_DEV ? DEV_REQUEST_DELAY : 0)
  }

  /**
   * 判断网络请求状态码
   * @param {*} response
   */
  function handleStatus(response) {
    if (!response || !response.data) {
      throw new Error(MESSAGE_ERROR);
    }

    switch (response.data.code) {
      case CODE_SUCCESS: return response;
      case CODE_ERROR: throw new Error(response.data)
      case CODE_AUTH_EXPIRED: updateStorage(); break;
      default: throw new Error(MESSAGE_ERROR)
    }
  }

  /**
   * 网络请求出错时
   * 进行提示 并 调用错误回调函数
   * @param {*} error
   */
  function handleError(error) {
    if (error.code === CODE_AUTH_EXPIRED && autoLogin) {
      Taro.navigateTo({
        url: '/pages/user-login/user-login'
      })
    } else {
      error.message = error.message || MESSAGE_ERROR

      showToast && Taro.showToast({
        icon: 'none',
        title: error.message,
      })
    }

    return fail(error)
  }

  /**
   * 当数据请求完成时调用
   * 开发环境增加模拟请求延迟
   */
  function handleComplete() {
    showLoading && Taro.hideLoading()
    return setTimeout(() => complete(), IS_DEV ? DEV_REQUEST_DELAY : 0)
  }

  /**
   * 显示数据加载
   */
  showLoading && Taro.showLoading({
    title: '加载中',
    mask: true
  })

  return Taro.request({ url, data, header, method })
    .then(handleStatus)
    .then(handleSuccess)
    .catch(handleError)
    .then(handleComplete)
}
