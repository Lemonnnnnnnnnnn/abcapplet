import { createAction } from '@utils/redux'

import {
  API_SEARCH_APARTMENT,

} from '@constants/api'

import {

  SET_APARTMENT_LIST_TWO,
  SET_NEXT_PAGE_APARTMENT_LIST_TWO,

  TYPE_SEARCH_APARTMENT,

} from '@constants/apartment'

/**
 * 搜索合集
 */
export const dispatchSearchApartmentList = payload => createAction({
    payload,
    method: 'POST',
    type: SET_APARTMENT_LIST_TWO,
    url: API_SEARCH_APARTMENT,
    cb: ({ data: { data } }) => ({
      list: data.list,
      total: data.total,
      type: TYPE_SEARCH_APARTMENT
    })
  })
  
  /**
   * 搜索合集下一页
   */
  export const dispatchNextPageSearchApartmentList = payload => createAction({
    payload,
    method: 'POST',
    type: SET_NEXT_PAGE_APARTMENT_LIST_TWO,
    url: API_SEARCH_APARTMENT,
    cb: ({ data: { data } }) => ({
      list: data.list,
      total: data.total,
      type: TYPE_SEARCH_APARTMENT
    })
  })