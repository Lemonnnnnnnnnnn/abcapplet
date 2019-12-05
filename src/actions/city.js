import { SET_CITY_LIST } from '@constants/city'
import { API_CITY_LIST } from '@constants/api'
import { createAction } from '@utils/redux'

/**
 * 获取城市列表
 * @param {*} payload
 */
export const dispatchCityList = () => createAction({
  payload: {},
  method: 'POST',
  type: SET_CITY_LIST,
  url: API_CITY_LIST,
  cb: (res) => res.data.data.list
})


