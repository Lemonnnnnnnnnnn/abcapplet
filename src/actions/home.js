import { HOME_CITY_LIST } from '@constants/home'
import { API_CITY_LIST } from '@constants/api'
import { createAction } from '@utils/redux'
import Taro from '@tarojs/taro'

/**
 * 获取城市列表
 * @param {*} payload
 */
export const dispatchCityList = () => createAction({
  payload: {},
  method: 'POST',
  type: HOME_CITY_LIST,
  url: API_CITY_LIST,
  cb: (res) => res.data.data.list,
})
