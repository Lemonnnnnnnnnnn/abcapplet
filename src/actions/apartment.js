import { createAction } from '@utils/redux'

import {
  API_APARTMENT_LIST,
  PAYLOAD_APARTMENT_LIST,
  API_FAVORITE_APARTMENT_LIST,
  API_FAVORITE_HOUSE_TYPE_LIST,
} from '@constants/api'

import {
  SET_APARTMENT_LIST,
  SET_NEXT_PAGE_APARTMENT_LIST,
  TYPE_NORMAL_APARTMENT,
  TYPE_FAVORITE_APARTMENT,
  TYPE_FAVORITE_HOUSE_TYPE,
} from '@constants/apartment'

/**
 * 获取公寓列表
 * @param {*} payload
 */
export const dispatchApartmentList = payload => createAction({
  payload: { ...PAYLOAD_APARTMENT_LIST, ...payload },
  method: 'POST',
  type: SET_APARTMENT_LIST,
  url: API_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_NORMAL_APARTMENT })
})

/**
 * 获取公寓列表下一页
 * @param {*} payload
 */
export const dispatchNextPageApartmentList = payload => createAction({
  payload: { ...PAYLOAD_APARTMENT_LIST, ...payload },
  method: 'POST',
  type: SET_NEXT_PAGE_APARTMENT_LIST,
  url: API_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_NORMAL_APARTMENT })
})

/**
 * 获取心愿公寓
 */
export const dispatchFavoriteApartmentList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_APARTMENT_LIST,
  url: API_FAVORITE_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_FAVORITE_APARTMENT })
})

/**
 * 获取心愿公寓下一页
 */
export const dispatchNextPageFavoriteApartmentList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_NEXT_PAGE_APARTMENT_LIST,
  url: API_FAVORITE_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_FAVORITE_APARTMENT })
})

/**
 * 获取心愿房型
 */
export const dispatchFavoriteHouseTypeList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_APARTMENT_LIST,
  url: API_FAVORITE_HOUSE_TYPE_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_FAVORITE_HOUSE_TYPE })
})

/**
 * 获取心愿房型下一页
 */
export const dispatchNextPageFavoriteHouseTypeList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_NEXT_PAGE_APARTMENT_LIST,
  url: API_FAVORITE_HOUSE_TYPE_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_FAVORITE_HOUSE_TYPE })
})
