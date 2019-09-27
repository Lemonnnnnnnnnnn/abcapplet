import { createAction } from '@utils/redux'

import {
  API_APARTMENT_LIST,
  PAYLOAD_APARTMENT_LIST,
  API_CBD_APARTMENT_LIST,
  API_ACTIVITY_APARTMENT_LIST,
  API_FAVORITE_APARTMENT_LIST,
  API_FAVORITE_HOUSE_TYPE_LIST,

  API_HOT_SEARCH,
  API_APARTMENT_SHOW,
  API_HOUSE_TYPE_SHOW,
  API_SEARCH_APARTMENT,
  API_RECOMMEND_APARTMENT,

  API_APPOINTMENT_CREATE,
  API_APPOINTMENT_SHOW,
  API_APARTMENT_NEARBYPOST,
  API_APARTMENT_INDEXDATAPOAT,
  API_HOUSETYPE_INDEXDATAPOAT,
  API_APARTMENT_REMAINTIME,
} from '@constants/api'

import {
  SET_HOT_SEARCH,
  SHOW_APARTMENT,
  SHOW_HOUSE_TYPE,
  SET_APARTMENT_LIST,
  SET_ARTICLE_APARTMENT_LIST,
  SET_ACTIVITY_APARTMENT_LIST,
  SET_NEXT_PAGE_APARTMENT_LIST,
  SET_NEXT_PAGE_ACTIVITY_APARTMENT_LIST,
  SET_APARTMENT_LOOK_LIST,
  SET_CBD_APARTMENT_LIST,
  SET_NEXT_PAGE_CBD_APARTMENT_LIST,
  TYPE_CBD_APARTMENT,
  TYPE_SEARCH_APARTMENT,
  SET_NEXT_PAGE_FAVORITE_HOUSETYPE_LIST,
  TYPE_NORMAL_APARTMENT,
  TYPE_FAVORITE_APARTMENT,
  TYPE_ACTIVITY_APARTMENT,
  TYPE_RECOMMEND_HOUSE_TYPE,
  TYPE_FAVORITE_HOUSE_TYPE,
  TYPE_ARTICLE_APARTMENT,
  SET_FAVORITE_HOUSETYPE_LIST,
  TYPE_APPOINTMENT_CREATE,
  TYPE_APPOINTMENT_SHOW,
  TYPE_APARTMENT_NEARBYPOST,
  SET_FAVORITE_APARTMENT_LIST,
  SET_NEXT_PAGE_FAVORITE_APARTMENT_LIST,
  TYPE_APARTMENT_INDEXDATAPOAT,
  TYPE_HOUSETYPE_INDEXDATAPOAT,
  TYPE_APARTMENT_REMAINTIME,
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
  type: SET_FAVORITE_APARTMENT_LIST,
  url: API_FAVORITE_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_FAVORITE_APARTMENT })
})

/**
 * 获取心愿公寓下一页
 */
export const dispatchNextPageFavoriteApartmentList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_NEXT_PAGE_FAVORITE_APARTMENT_LIST,
  url: API_FAVORITE_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_FAVORITE_APARTMENT })
})

/**
 * 获取心愿房型
 */
export const dispatchFavoriteHouseTypeList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_FAVORITE_HOUSETYPE_LIST,
  url: API_FAVORITE_HOUSE_TYPE_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_FAVORITE_HOUSE_TYPE })
})

/**
 * 获取心愿房型下一页
 */
export const dispatchNextPageFavoriteHouseTypeList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_NEXT_PAGE_FAVORITE_HOUSETYPE_LIST,
  url: API_FAVORITE_HOUSE_TYPE_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_FAVORITE_HOUSE_TYPE })
})


/**
 * 获取商圈集合信息下一页
 */
export const dispatchCbdApartmentList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_CBD_APARTMENT_LIST,
  url: API_CBD_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_CBD_APARTMENT })
})

/**
 * 获取商圈集合信息下一页
 */
export const dispatchNextPageCbdApartmentList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_NEXT_PAGE_CBD_APARTMENT_LIST,
  url: API_CBD_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_CBD_APARTMENT })
})

/**
 * 活动合集
 */
export const dispatchActivityApartmentList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_ACTIVITY_APARTMENT_LIST,
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
  type: SET_NEXT_PAGE_ACTIVITY_APARTMENT_LIST,
  url: API_ACTIVITY_APARTMENT_LIST,
  cb: ({ data: { data } }) => ({
    list: data.list.list,
    total: data.list.total,
    type: TYPE_ACTIVITY_APARTMENT
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


// /**
//  * 推荐公寓列表
//  */

export const dispatchRecommendHouseType = payload => createAction({
  payload,
  method: 'POST',
  type: SET_APARTMENT_LOOK_LIST,
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
  type: SET_ARTICLE_APARTMENT_LIST,
  payload: {
    list: apartments,
    total: apartments.length,
    type: TYPE_ARTICLE_APARTMENT,
  }
})

/**
 * 公寓详情
 */
export const dispatchApartmentShow = payload => createAction({
  payload,
  method: 'POST',
  type: SHOW_APARTMENT,
  url: API_APARTMENT_SHOW,
  cb: ({ data: { data } }) => ({ ...data })
})

/**
 * 户型详情
 */
export const dispatchHouseTypeShow = payload => createAction({
  payload,
  method: 'POST',
  type: SHOW_HOUSE_TYPE,
  url: API_HOUSE_TYPE_SHOW,
})

/**
 * 提交预约看房
 */
export const dispatchAppointmentCreate = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_APPOINTMENT_CREATE,
  url: API_APPOINTMENT_CREATE ,
  // cb: ({ data: { data } }) => ({ ...data })
})

/**
 * 获取行程详情
 */
export const dispatchAppointmentDetail = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_APPOINTMENT_SHOW,
  url: API_APPOINTMENT_SHOW ,
})


// 获取附近公寓列表
export const dispatchAppointmentNearbyPost = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_APARTMENT_NEARBYPOST,
  url: API_APARTMENT_NEARBYPOST ,
})


// 获取公寓详情页面数据统计
export const dispatchApartmentDataPost = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_APARTMENT_INDEXDATAPOAT,
  url: API_APARTMENT_INDEXDATAPOAT ,
})
// 获取户型详情页面数据统计
export const dispatchApartmentHouseDataPost = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_HOUSETYPE_INDEXDATAPOAT,
  url: API_HOUSETYPE_INDEXDATAPOAT ,
})

// 获取签约下定页面停留的时间
export const dispatchApartmentRemainTime = payload => createAction({
  payload,
  method: 'POST',
  type: TYPE_APARTMENT_REMAINTIME,
  url: API_APARTMENT_REMAINTIME ,
})




