import { createAction } from '@utils/redux'
import { API_APARTMENT_LIST, PAYLOAD_APARTMENT_LIST } from '@constants/api'
import { SET_APARTMENT_LIST, SET_NEXT_PAGE_APARTMENT_LIST } from '@constants/apartment'

/**
 * 获取公寓列表
 * @param {*} payload
 */
export const dispatchApartmentList = payload => createAction({
  payload: { ...PAYLOAD_APARTMENT_LIST, ...payload },
  method: 'POST',
  type: SET_APARTMENT_LIST,
  url: API_APARTMENT_LIST,
  cb: (res) => res.data.data.list,
})

/**
 * 获取公寓列表
 * @param {*} payload
 */
export const dispatchNextPageApartmentList = payload => createAction({
  payload: { ...PAYLOAD_APARTMENT_LIST, ...payload },
  method: 'POST',
  type: SET_NEXT_PAGE_APARTMENT_LIST,
  url: API_APARTMENT_LIST,
  cb: (res) => res.data.data.list,
})
