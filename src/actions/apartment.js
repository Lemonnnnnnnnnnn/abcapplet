import { createAction } from '@utils/redux'

import {
  API_APARTMENT_LIST,
  PAYLOAD_APARTMENT_LIST,
  API_FAVORITE_APARTMENT_LIST,
  API_FAVORITE_HOUSE_TYPE_LIST,
  API_CBD_APARTMENT_LIST,
  API_ACTIVITY_APARTMENT_LIST,

  API_SEARCH_APARTMENT,
  API_HOT_SEARCH,
  API_RECOMMEND_APARTMENT,
  API_APARTMENT_SHOW,
} from '@constants/api'

import {
  SET_HOT_SEARCH,
  SHOW_APARTMENT,
  SET_APARTMENT_LIST,
  SET_NEXT_PAGE_APARTMENT_LIST,

  TYPE_CBD_APARTMENT,
  TYPE_SEARCH_APARTMENT,
  TYPE_NORMAL_APARTMENT,
  TYPE_FAVORITE_APARTMENT,
  TYPE_ACTIVITY_APARTMENT,
  TYPE_RECOMMEND_HOUSE_TYPE,
  TYPE_FAVORITE_HOUSE_TYPE,
  TYPE_ARTICLE_APARTMENT,
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


/**
 * 获取商圈集合信息下一页
 */
export const dispatchCbdApartmentList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_APARTMENT_LIST,
  url: API_CBD_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_CBD_APARTMENT })
})

/**
 * 获取商圈集合信息下一页
 */
export const dispatchNextPageCbdApartmentList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_NEXT_PAGE_APARTMENT_LIST,
  url: API_CBD_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_CBD_APARTMENT })
})

/**
 * 活动合集
 */
export const dispatchActivityApartmentList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_APARTMENT_LIST,
  url: API_ACTIVITY_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({
    list: data.list.list,
    total: data.list.total,
    type: TYPE_ACTIVITY_APARTMENT
  })
})

/**
 * 活动合集下一页
 */
export const dispatchNextPageActivityApartmentList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_NEXT_PAGE_APARTMENT_LIST,
  url: API_ACTIVITY_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({
    list: data.list.list,
    total: data.list.total,
    type: TYPE_ACTIVITY_APARTMENT
  })
})


/**
 * 搜索合集
 */
export const dispatchSearchApartmentList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_APARTMENT_LIST,
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
  type: SET_NEXT_PAGE_APARTMENT_LIST,
  url: API_SEARCH_APARTMENT,
  cb: ({ data: { data } }) => ({
    list: data.list,
    total: data.total,
    type: TYPE_SEARCH_APARTMENT
  })
})

/**
 * 搜索关键词
 */
export const dispatchHotSearch = payload => createAction({
  payload,
  method: 'POST',
  type: SET_HOT_SEARCH,
  url: API_HOT_SEARCH,
})

/**
 * 推荐公寓列表
 */
export const dispatchRecommendHouseType = payload => createAction({
  payload,
  method: 'POST',
  type: SET_APARTMENT_LIST,
  url: API_RECOMMEND_APARTMENT,
  cb: ({ data: { data } }) => ({
    list: data.list,
    total: data.list.length,
    type: TYPE_RECOMMEND_HOUSE_TYPE,
  })
})

/**
 * 设置文章公寓
 */
export const dispatchArticleApartment = (apartments) => ({
  type: SET_APARTMENT_LIST,
  payload: {
    list: apartments,
    total: apartments.length,
    type: TYPE_ARTICLE_APARTMENT,
  }
})

/**
 * 设置公寓详情
 */
export const dispatchApartmentShow = payload => createAction({
  payload,
  method: 'POST',
  type: SHOW_APARTMENT,
  url: API_APARTMENT_SHOW,
  cb: ({ data: { data } }) => ({ ...data })
})

